import type { GatsbyNode, Page } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";
import buildPaginatedUrl from "./src/util/build-paginated-url";

export const onCreateNode: GatsbyNode[`onCreateNode`] = async ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);
    const { sourceInstanceName } = parent;
    createNodeField({
      name: "sourceFileType",
      node,
      value: sourceInstanceName,
    });

    switch (sourceInstanceName) {
      case `posts`:
        createNodeField({
          name: `slug`,
          node,
          value: `/posts${createFilePath({ node, getNode })}`,
        });
        break;

      case `works`:
        const [, order, ...fp] = createFilePath({ node, getNode }).split(`/`);
        createNodeField({
          name: `order`,
          node,
          value: order,
        });
        createNodeField({
          name: `slug`,
          node,
          value: `/works/${fp.join(`/`)}`,
        });
        break;

      default:
        throw new Error(`Unknown sourceInstanceName: ${sourceInstanceName}`);
    }
  }
};

export const createPages: GatsbyNode[`createPages`] = async ({
  graphql,
  actions: { createPage },
}) => {
  await Promise.all([createPostPages(), createWorkPages(), createTagPages()]);

  function createPagination<T>(
    args: Page<T> & { itemsPerPage: number; itemCount: number },
  ) {
    const { itemsPerPage, itemCount, ...page } = args;
    const numPages = Math.ceil(itemCount / itemsPerPage);
    for (let i = 0; i < numPages; i++) {
      const currentPage = i + 1;
      createPage({
        ...page,
        path: buildPaginatedUrl(args.path, currentPage),
        context: {
          ...page.context,
          limit: itemsPerPage,
          skip: i * itemsPerPage,
          numPages,
          currentPage,
        },
      });
    }
  }

  async function createPostPages() {
    const result = await graphql<{
      allMdx: { nodes: { id: string; fields: { slug: string } }[] };
    }>(`
      {
        allMdx(
          filter: { fields: { sourceFileType: { eq: "posts" } } }
          sort: { fields: frontmatter___date, order: DESC }
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `);
    if (result.errors) {
      throw result.errors;
    }

    // Create post-list pages
    createPagination({
      path: `/posts`,
      component: path.resolve(`src/templates/post-list/index.tsx`),
      context: {},
      itemCount: result.data.allMdx.nodes.length,
      itemsPerPage: 10,
    });

    // Create post pages
    result.data.allMdx.nodes.forEach(({ id, fields: { slug } }) => {
      createPage({
        path: slug,
        component: path.resolve(`src/templates/post/index.tsx`),
        context: { id },
      });
    });
  }

  async function createWorkPages() {
    const result = await graphql<{
      allMdx: { nodes: { id: string; fields: { slug: string } }[] };
    }>(`
      {
        allMdx(
          filter: { fields: { sourceFileType: { eq: "works" } } }
          sort: { fields: fields___order }
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `);
    if (result.errors) {
      throw result.errors;
    }

    // Create work-list pages
    createPagination({
      path: `/works`,
      component: path.resolve(`src/templates/work-list/index.tsx`),
      context: {},
      itemCount: result.data.allMdx.nodes.length,
      itemsPerPage: 10,
    });

    // Create work pages
    result.data.allMdx.nodes.forEach(({ id, fields: { slug } }) => {
      createPage({
        path: slug,
        component: path.resolve(`src/templates/work/index.tsx`),
        context: { id },
      });
    });
  }

  async function createTagPages() {
    const result = await graphql<{
      allMdx: { group: { tag: string; totalCount: number }[] };
    }>(`
      {
        allMdx(sort: { fields: frontmatter___date, order: DESC }) {
          group(field: frontmatter___tags) {
            tag: fieldValue
            totalCount
          }
        }
      }
    `);
    if (result.errors) {
      throw result.errors;
    }

    // Create tag pages
    result.data.allMdx.group.forEach(({ tag, totalCount }) => {
      createPagination({
        path: `/tags/${tag}`,
        component: path.resolve(`src/templates/post-list/tagged.tsx`),
        context: { tag },
        itemCount: totalCount,
        itemsPerPage: 10,
      });
    });
  }
};
