# Personal Website

Portfolio site of Yazan Dukhan, software engineer. Built with [Astro](https://astro.build) and TypeScript,
published to GitHub Pages by GitHub Actions.

## Project layout

```
src/
  content/work/       one Markdown file per job or project (becomes /work/<file-name>/)
  content.config.ts   the fields every work entry must have
  data/site.ts        name, email, links, calls, certifications, AI API URL
  data/answers.ts     built-in answers for the chat (used when the AI is unavailable)
  components/         page sections (hero, work entry, booking, chat widget, resume dialog)
  layouts/Base.astro  shared <head>, fonts and footer
  pages/              home page, work pages and 404
  styles/global.css   all styles
public/               files served as they are (resume, favicon)
ask-api/              Cloudflare Worker for the AI answers (separate project)
```

## Run locally

Requires Node.js 22.23.4 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:4321/. `npm run build` type-checks and builds into `dist/`.

## Add a project

Create `src/content/work/my-project.md`:

```markdown
---
title: My project
context: Personal project
kind: project            # or: job
start: 2026-01-01
end: 2026-03-31          # leave out if ongoing
summary: One or two sentences for the home page.
stack: ["TypeScript", "Astro"]
links:
  live: https://example.com
  code: https://github.com/user462138/my-project
---

## The problem

Write the case study here in Markdown.
```

The build fails with a clear message if a required field is missing.

## Deploy

Every push to `main` builds the site and publishes it. In the repository settings, set
**Settings → Pages → Source** to **GitHub Actions** once. Pull requests get a build check but aren't published.

The site lives at https://yazandukhan.com. The domain is registered at Squarespace and its DNS points at GitHub Pages:

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| AAAA  | @    | 2606:50c0:8000::153 |
| AAAA  | @    | 2606:50c0:8001::153 |
| AAAA  | @    | 2606:50c0:8002::153 |
| AAAA  | @    | 2606:50c0:8003::153 |
| CNAME | www  | user462138.github.io |

The custom domain is set under **Settings → Pages → Custom domain**, with **Enforce HTTPS** on.

## AI chat

The chat button in the corner answers with Claude through a small Cloudflare Worker in `ask-api/`.
The Worker keeps the Anthropic API key secret; the page itself never sees it.
Until the Worker is deployed and `askApi` is set in `src/data/site.ts`, the chat uses built-in keyword answers,
and it falls back to them whenever the API can't be reached.

What Claude knows about me is in `ask-api/src/profile.js`. Update it when the resume changes.

### Deploy the Worker

You need a free Cloudflare account and an Anthropic API key from console.anthropic.com.

```bash
cd ask-api
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL. Put it, followed by `/ask`, into `askApi` in `src/data/site.ts`.

Safeguards: only the origins in `ALLOWED_ORIGINS` (`wrangler.toml`) can call it, each visitor IP gets 10 questions per minute,
and questions are capped at 300 characters. Set a monthly spend limit in the Anthropic Console as well.

The Worker uses Claude Haiku 5.5 at low effort, with the profile prompt cached between questions.
A typical question costs about $0.0002 (roughly 5,000 questions per dollar).
To see the real token usage of each question, run `npx wrangler tail` in `ask-api/` and ask something on the site.
