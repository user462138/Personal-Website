# Personal Website

Portfolio site of Yazan Dukhan, software engineer.

A single static page with no build step:

- `index.html` contains the page, its styles and its scripts
- `resume/` holds the resume as a PDF and a PNG preview

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deploy

The site is served by GitHub Pages from the `main` branch root.

## AI Q&A (optional)

The "Questions" box answers with Claude through a small Cloudflare Worker in `ask-api/`.
The Worker keeps the Anthropic API key secret; the page itself never sees it.
Until the Worker is deployed and `ASK_API` is set in `index.html`, the box uses built-in keyword answers,
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

`wrangler deploy` prints the Worker URL. Put it, followed by `/ask`, into `ASK_API` near the top of the script in `index.html`.

Safeguards: only the origins in `ALLOWED_ORIGINS` (`wrangler.toml`) can call it, each visitor IP gets 10 questions per minute,
and questions are capped at 300 characters. Set a monthly spend limit in the Anthropic Console as well.
