// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The site is served by GitHub Pages at https://user462138.github.io/Personal-Website/.
// Once yazandukhan.com points at GitHub Pages, change these to:
//   site: "https://yazandukhan.com", base: "/"
// and add public/CNAME containing "yazandukhan.com".
export default defineConfig({
  site: "https://user462138.github.io",
  base: "/Personal-Website",
  trailingSlash: "ignore",
  integrations: [sitemap()],
});
