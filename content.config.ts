import { resolve } from "node:path";
import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { glob } from "fast-glob";

console.log("glob?", glob);
glob("./repos/website/**/*.md").then((x) => {
  console.log(x);
});

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: "page",
      source: {
        cwd: "./repos/website",
        include: "**/*.md",
      },
    }),
    pages: defineCollection({
      type: "page",
      source: {
        cwd: "./repos/website/pages",
        include: "**/*.md",
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.string(),
        image: z.string(),
        status: z.enum(["published", "draft"]),
      }),
    }),
    news: defineCollection({
      type: "page",
      source: {
        cwd: "./repos/website/pages/news",
        include: "**/*.md",
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.string(),
        image: z.string(),
        status: z.enum(["published", "draft"]),
      }),
    }),
    guides: defineCollection({
      type: "page",
      source: {
        cwd: "./repos/website/pages/guides",
        include: "**/*.md",
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        image: z.string(),
        status: z.enum(["published", "draft"]),
      }),
    }),
  },
});
