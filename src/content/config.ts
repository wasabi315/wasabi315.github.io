import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
  }),
});

const worksCollection = defineCollection({
  type: "content",
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
