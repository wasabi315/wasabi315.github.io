import { CreatePagesArgs, GatsbyNode } from "gatsby";
import path from "path";
import buildPaginatedUrl from "./src/util/build-paginated-url";

const createPostPages = async ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions;

  const result = await graphql<{
    allMdx: { nodes: { id: string; slug: string }[] };
  }>(`
    {
      allMdx(
        filter: { slug: { regex: "/^posts//" } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
          id
          slug
        }
      }
    }
  `);
  if (result.errors) {
    throw result.errors;
  }

  // Create post list pages.
  const posts = result.data.allMdx.nodes;
  const postsPerPage = 10;
  const numPages = Math.ceil(posts.length / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    const currentPage = i + 1;
    createPage({
      path: buildPaginatedUrl(`/posts`, currentPage),
      component: path.resolve(`src/templates/post-list/index.tsx`),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage,
      },
    });
  });

  // Create post pages.
  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    createPage({
      path: slug,
      component: path.resolve(`src/templates/post/index.tsx`),
      context: { id },
    });
  });
};

const createWorkPages = async ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions;

  const result = await graphql<{
    allMdx: { nodes: { id: string; slug: string }[] };
  }>(`
    {
      allMdx(
        filter: { slug: { regex: "/^works//" } }
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        nodes {
          id
          slug
        }
      }
    }
  `);
  if (result.errors) {
    throw result.errors;
  }

  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    createPage({
      path: slug,
      component: path.resolve(`src/templates/work/index.tsx`),
      context: { id },
    });
  });
};

const createTagPages = async ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions;

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

  result.data.allMdx.group.forEach(({ tag, totalCount }) => {
    const postsPerPage = 10;
    const numPages = Math.ceil(totalCount / postsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      const currentPage = i + 1;
      createPage({
        path: buildPaginatedUrl(`/tags/${tag}`, currentPage),
        component: path.resolve(`src/templates/post-list/tagged.tsx`),
        context: {
          tag,
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage,
        },
      });
    });
  });
};

export const createPages: GatsbyNode["createPages"] = async (args) => {
  await Promise.all([
    createPostPages(args),
    createWorkPages(args),
    createTagPages(args),
  ]);
};
