import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import icon from "astro-icon";
import agda from "./src/data/agda.tmLanguage.json";

// https://astro.build/config
export default defineConfig({
  site: "https://wasabi315.github.io",
  integrations: [mdx(), icon()],
  markdown: {
    shikiConfig: {
      theme: "nord",
      langs: ["javascript", "typescript", "haskell", "ocaml", "rust", agda],
    },
    remarkPlugins: [remarkToc, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      rehypeKatex,
    ],
  },
});
