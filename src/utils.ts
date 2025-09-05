import type { CollectionEntry } from "astro:content";

// Array.fromAsync cannot be used for getStaticPaths
export async function arrayFromAsyncIterable<T>(
  asyncIterable: AsyncIterable<T>
): Promise<Array<T>> {
  const result = [];
  for await (const elem of asyncIterable) {
    result.push(elem);
  }
  return result;
}

export const sortPosts = (
  posts: CollectionEntry<"posts">[]
): CollectionEntry<"posts">[] =>
  posts.sort(
    (a, b) =>
      -a.data.date.localeCompare(b.data.date) ||
      -a.data.title.localeCompare(b.data.title)
  );
