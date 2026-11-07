// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The site is served by GitHub Pages at https://yazandukhan.com.
// The domain is set in the repository under Settings → Pages → Custom domain,
// and its DNS records point at GitHub Pages (see README).
export default defineConfig({
  site: "https://yazandukhan.com",
  base: "/",
  trailingSlash: "ignore",
  integrations: [sitemap()],
});
