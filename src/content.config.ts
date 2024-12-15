import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const postsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
  }),
});

const worksCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "src/content/works",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      description: z.string(),
      featuredImage: image(),
      thumbnail: image(),
      githubRepository: z.string(),
    }),
});

export const collections = {
  posts: postsCollection,
  works: worksCollection,
};
