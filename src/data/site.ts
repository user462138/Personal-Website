export const site = {
  name: "Yazan Dukhan",
  title: "Yazan Dukhan · Software Engineer",
  description: "Yazan Dukhan, software engineer building software and AI that helps people explore more.",
  email: "yazandukhan@hotmail.com",
  github: "https://github.com/user462138",
  calls: [
    { title: "Quick intro", text: "Say hello, ask about my work or a role.", length: "15 min", href: "https://cal.com/yazandukhan/15min" },
    { title: "Talk about a project", text: "Walk me through what you'd like to build.", length: "30 min", href: "https://cal.com/yazandukhan/30min" },
  ],
  certifications: [
    {
      title: "Associate AI Engineer for Developers",
      issuer: "DataCamp",
      year: 2026,
      text: "Building with the OpenAI API, embeddings, LangChain agents, Pinecone, Hugging Face and MCP.",
    },
  ],
  /**
   * URL of the deployed ask-api Worker, e.g. "https://portfolio-ask-api.<your-subdomain>.workers.dev/ask".
   * Leave empty to use only the built-in keyword answers in src/data/answers.ts.
   */
  askApi: "https://portfolio-ask-api.yazandukhan.workers.dev/ask",
} as const;

/** Prefix a site path with the configured base, e.g. url("/work/numble/"). */
export function url(path = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base + (path.startsWith("/") ? path : `/${path}`);
}
