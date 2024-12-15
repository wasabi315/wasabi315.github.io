import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import remarkLinkCard from "remark-link-card";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import icon from "astro-icon";
import agda from "./src/data/agda.tmLanguage.json";

// https://astro.build/config
export default defineConfig({
  site: "https://wasabi315.github.io",
  integrations: [
    mdx(),
    icon(),
    // Ref: https://www.kevinzunigacuellar.com/blog/google-analytics-in-astro/
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "nord",
      langs: [
        "javascript",
        "typescript",
        "haskell",
        "ocaml",
        "rust",
        agda,
        "scheme",
        "latex",
      ],
    },
    remarkPlugins: [
      [remarkToc, { heading: "(table[ -]of[ -])?contents?|toc|目次" }],
      remarkMath,
      [remarkLinkCard, { shortenUrl: true }],
      remarkAlert,
    ],
    rehypePlugins: [
      rehypeRaw,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      rehypeKatex,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
});
