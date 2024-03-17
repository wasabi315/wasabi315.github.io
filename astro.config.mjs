import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import icon from "astro-icon";
import agda from "./src/data/agda.tmLanguage.json";

// https://astro.build/config
export default defineConfig({
  site: "https://wasabi315.github.io",
  integrations: [mdx(), icon()],
  markdown: {
    shikiConfig: {
      theme: "nord",
      // langs: [agda],
    },
    remarkPlugins: [remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
    ],
  },
});
