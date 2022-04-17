import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";
import { paginate } from "gatsby-awesome-pagination";

export const onCreateNode: GatsbyNode[`onCreateNode`] = async ({
  node,
  actions: { createNodeField },
  getNode,
  reporter,
}) => {
  if (node.internal.type === `Mdx`) {
    const parent = node.parent && getNode(node.parent);
    if (!parent) {
      reporter.panicOnBuild(`No parent found for ${node.id}`);
      return;
    }
    const sourceInstanceName = parent.sourceInstanceName as string;
    createNodeField({
      name: `sourceFileType`,
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
          value: parseInt(order, 10),
        });
        createNodeField({
          name: `slug`,
          node,
          value: `/works/${fp.join(`/`)}`,
        });
        break;

      default:
        reporter.panicOnBuild(
          `Unknown sourceInstanceName: ${sourceInstanceName}`,
        );
        return;
    }
  }
};

export const createPages: GatsbyNode[`createPages`] = async ({
  graphql,
  actions: { createPage },
  reporter,
}) => {
  await Promise.all([createPostPages(), createWorkPages(), createTagPages()]);

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
    if (result.errors || !result.data) {
      reporter.panicOnBuild(result.errors);
      return;
    }

    // Create post-list pages
    paginate({
      createPage,
      items: result.data.allMdx.nodes,
      itemsPerPage: 10,
      pathPrefix: `/posts`,
      component: path.resolve(`./src/templates/post-list/index.tsx`),
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
    type ImageData = {
      absolutePath: string;
      childImageSharp: {
        original: {
          height: number;
          width: number;
        };
      };
    };

    const result = await graphql<{
      allMdx: {
        nodes: {
          id: string;
          fields: { slug: string };
          frontmatter: {
            featuredImage: ImageData;
            thumbnail: ImageData;
          };
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
            frontmatter {
              featuredImage {
                absolutePath
                childImageSharp {
                  original {
                    height
                    width
                  }
                }
              }
              thumbnail {
                absolutePath
                childImageSharp {
                  original {
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    `);
    if (result.errors || !result.data) {
      reporter.panicOnBuild(result.errors);
      return;
    }

    // Check aspect ratio of featured images and thumbnails
    const checkAspectRatio = (expected: number, image: ImageData) => {
      const { height, width } = image.childImageSharp.original;
      const actual = height / width;
      if (expected !== actual) {
        reporter.warn(
          `Expected aspect ratio of ${expected} but got ${actual} for ${height}x${width}: ${image.absolutePath}`,
        );
      }
    };
    result.data.allMdx.nodes.forEach(({ frontmatter }) => {
      checkAspectRatio(9 / 16, frontmatter.featuredImage);
      checkAspectRatio(5 / 4, frontmatter.thumbnail);
    });

    // Create work-list pages
    paginate({
      createPage,
      items: result.data.allMdx.nodes,
      itemsPerPage: 10,
      pathPrefix: `/works`,
      component: path.resolve(`./src/templates/work-list/index.tsx`),
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
      reporter.panicOnBuild(result.errors);
      return;
    }

    // Create tag pages
    result.data.allMdx.group.forEach(({ tag, nodes }) => {
      paginate({
        createPage,
        items: nodes,
        itemsPerPage: 10,
        pathPrefix: `/tags/${tag}`,
        component: path.resolve(`./src/templates/post-list/tagged.tsx`),
        context: { tag },
      });
    });
  }
};
