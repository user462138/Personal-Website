import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./profile.js";

const MODEL = "claude-haiku-5-5";
const MAX_QUESTION = 300;
const MAX_HISTORY = 6; // earlier messages kept for follow-up questions

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
  return allowed.includes(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : null;
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

// Accept only well-formed, alternating, short text turns from the browser.
function cleanHistory(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const m of raw.slice(-MAX_HISTORY)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return [];
    const expected = out.length % 2 === 0 ? "user" : "assistant";
    if (m.role !== expected) return [];
    out.push({ role: m.role, content: m.content.slice(0, 1200) });
  }
  return out.length % 2 === 0 ? out : out.slice(0, -1);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);
    const url = new URL(request.url);

    if (url.pathname !== "/ask") return new Response("Not found", { status: 404 });
    if (!cors) return new Response("Forbidden", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, cors);

    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ error: "rate_limited" }, 429, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad_request" }, 400, cors);
    }
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!question || question.length > MAX_QUESTION) return json({ error: "bad_request" }, 400, cors);

    // ANTHROPIC_BASE_URL is only for local testing; leave it unset in production.
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, baseURL: env.ANTHROPIC_BASE_URL || undefined });
    // Claude Haiku 5.5 at low effort: answering from a one-page profile doesn't need a bigger model.
    // Low effort lets it skip thinking on simple questions; max_tokens caps the cost of any one answer.
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      // The profile is identical on every request, so cache it: follow-up questions within
      // 5 minutes read it at a tenth of the normal input price.
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [...cleanHistory(body.history), { role: "user", content: question }],
    });

    // Stream plain text to the browser as it arrives.
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          // Log the model and token usage per question (visible with `npx wrangler tail`).
          // This runs before close(): Cloudflare may stop the Worker once the response is finished.
          const { model, usage } = await stream.finalMessage();
          console.log(JSON.stringify({ model, usage }));
          controller.close();
        } catch (err) {
          if (err instanceof Anthropic.RateLimitError) console.error("Anthropic rate limit", err.status);
          else if (err instanceof Anthropic.APIConnectionError) console.error("Anthropic connection error", err.message);
          else if (err instanceof Anthropic.APIError) console.error("Anthropic API error", err.status, err.message);
          else console.error("Unexpected error", err);
          // The browser treats an empty or broken stream as "AI unavailable" and uses its built-in answers.
          controller.error(err);
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Answer-Model": MODEL },
    });
  },
};
