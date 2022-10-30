import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";

export const onCreateNode: GatsbyNode[`onCreateNode`] = async ({
  node,
  actions: { createNodeField },
  getNode,
}) => {
  if (node.internal.type === `Mdx`) {
    const parent = node.parent && getNode(node.parent);
    if (!parent) {
      throw new Error(`Error: parent not found for node ${node.id}`);
    }
    const sourceInstanceName = parent.sourceInstanceName as string;
    createNodeField({
      name: `sourceFileType`,
      node,
      value: sourceInstanceName,
    });

    const filePath = parent.relativePath as string;
    switch (sourceInstanceName) {
      case `posts`:
        createNodeField({
          name: `filePath`,
          node,
          value: `/posts/${filePath}`,
        });
        createNodeField({
          name: `slug`,
          node,
          value: `/posts${createFilePath({ node, getNode })}`,
        });
        break;

      case `works`:
        createNodeField({
          name: `filePath`,
          node,
          value: `/works/${filePath}`,
        });
        const [, order, ...fp] = createFilePath({ node, getNode }).split(`/`);
        createNodeField({
          name: `order`,
          node,
          value: parseInt(order, 10),
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

  type PaginateArgs = {
    items: unknown[];
    itemsPerPage: number;
    pathPrefix: string;
    component: string;
    context?: unknown;
  };

  function paginate(args: PaginateArgs) {
    const numPages = Math.ceil(args.items.length / args.itemsPerPage);
    const paths = Array.from({ length: numPages }, (_, i) =>
      i === 0 ? args.pathPrefix : `${args.pathPrefix}/${i + 1}`,
    );
    for (let i = 0; i < numPages; i++) {
      createPage({
        path: paths[i],
        component: args.component,
        context: {
          ...(args.context ?? {}),
          pageNumber: i,
          humanPageNumber: i + 1,
          skip: i * args.itemsPerPage,
          limit: args.itemsPerPage,
          numberOfPages: numPages,
          previousPagePath: paths[i - 1] ?? ``,
          nextPagePath: paths[i + 1] ?? ``,
        },
      });
    }
  }

  async function createPostPages() {
    const result = await graphql<{
      allMdx: {
        nodes: {
          id: string;
          fields: { slug: string };
          internal: { contentFilePath: string };
        }[];
      };
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
            internal {
              contentFilePath
            }
          }
        }
      }
    `);
    if (result.errors || !result.data) {
      throw result.errors;
    }

    // Create post-list pages
    paginate({
      items: result.data.allMdx.nodes,
      itemsPerPage: 10,
      pathPrefix: `/posts`,
      component: path.resolve(`./src/templates/post-list/index.tsx`),
    });

    // Create post pages
    const postTemplate = path.resolve(`src/templates/post/index.tsx`);
    result.data.allMdx.nodes.forEach(
      ({ id, fields: { slug }, internal: { contentFilePath } }) => {
        createPage({
          path: slug,
          component: `${postTemplate}?__contentFilePath=${contentFilePath}`,
          context: { id },
        });
      },
    );
  }

  async function createWorkPages() {
    const result = await graphql<{
      allMdx: {
        nodes: {
          id: string;
          fields: { slug: string };
          internal: { contentFilePath: string };
        }[];
      };
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
            internal {
              contentFilePath
            }
          }
        }
      }
    `);
    if (result.errors || !result.data) {
      throw result.errors;
    }

    // Create work-list pages
    paginate({
      items: result.data.allMdx.nodes,
      itemsPerPage: 10,
      pathPrefix: `/works`,
      component: path.resolve(`./src/templates/work-list/index.tsx`),
    });

    // Create work pages
    const workTemplate = path.resolve(`src/templates/work/index.tsx`);
    result.data.allMdx.nodes.forEach(
      ({ id, fields: { slug }, internal: { contentFilePath } }) => {
        createPage({
          path: slug,
          component: `${workTemplate}?__contentFilePath=${contentFilePath}`,
          context: { id },
        });
      },
    );
  }

  async function createTagPages() {
    const result = await graphql<{
      allMdx: { group: { tag: string; nodes: { id: string }[] }[] };
    }>(`
      {
        allMdx(sort: { fields: frontmatter___date, order: DESC }) {
          group(field: frontmatter___tags) {
            tag: fieldValue
            nodes {
              id
            }
          }
        }
      }
    `);
    if (result.errors || !result.data) {
      throw result.errors;
    }

    // Create tag pages
    result.data.allMdx.group.forEach(({ tag, nodes }) => {
      paginate({
        items: nodes,
        itemsPerPage: 10,
        pathPrefix: `/tags/${tag}`,
        component: path.resolve(`./src/templates/post-list/tagged.tsx`),
        context: { tag },
      });
    });
  }
};
