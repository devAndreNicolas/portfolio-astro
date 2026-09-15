import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const collections = {
  work: defineCollection({
    // Load Markdown files in the src/content/work directory.
    loader: glob({ base: "./src/content/work", pattern: "**/*.md" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      order: z.number().default(99),
      headline: z.string().optional(),
      role: z.string().optional(),
      disciplines: z.array(z.string()).default([]),
      visual: z.enum(["workflow", "consent", "commerce", "focus", "content", "social", "finance", "learning"]).default("workflow"),
      liveUrl: z.string().url().optional(),
      img: z.string().optional(),
      img_alt: z.string().optional(),
    }),
  }),
};
