import type { CollectionEntry } from "astro:content";

export const sortPosts = (
  posts: CollectionEntry<"posts">[]
): CollectionEntry<"posts">[] =>
  posts.sort(
    (a, b) =>
      -a.data.date.localeCompare(b.data.date) ||
      -a.data.title.localeCompare(b.data.title)
  );
