import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One Markdown file per job or project in src/content/work/.
// The file name becomes the page URL: numble.md -> /work/numble/
const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    /** Shown under the title, e.g. "Internship at Numble". */
    context: z.string(),
    kind: z.enum(["job", "project"]),
    /** Used for ordering (newest first) and the date column. */
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    /** Short summary used on the home page and as the page's description. */
    summary: z.string().max(320),
    stack: z.array(z.string()).default([]),
    links: z
      .object({
        live: z.string().optional(),
        code: z.string().optional(),
      })
      .default({}),
  }),
});

export const collections = { work };
