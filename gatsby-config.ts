import { GatsbyConfig } from "gatsby";
import path from "path";
import remarkEmoji from "remark-emoji";
import rehypeSlug from "rehype-slug";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypeSourceLine from "rehype-source-line";

const config: GatsbyConfig = {
  graphqlTypegen: true,
  siteMetadata: {
    title: `wasabi315`,
    description: `wasabi315's personal website`,
    author: `wasabi315`,
    siteUrl: `https://wasabi315.github.io/`,
    repositoryUrl: `https://github.com/wasabi315/wasabi315.github.io/`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [process.env.GA_TRACKING_ID],
        pluginConfig: {
          head: true,
        },
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.resolve(`src/images`),
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          placeholder: `none`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `wasabi315's personal page`,
        short_name: `wasabi315`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkEmoji],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutoLinkHeadings, { test: [`h1`, `h2`, `h3`, `h4`] }],
            // rehypeSourceLine,
          ],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              prompt: {
                global: true,
              },
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: path.resolve(`src/contents/posts`),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `works`,
        path: path.resolve(`src/contents/works`),
      },
    },
    `gatsby-source-local-git`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};

export default config;
