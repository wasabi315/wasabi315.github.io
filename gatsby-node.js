const path = require(`path`)

const createPostPages = async (graphql, actions) => {
  const { createPage } = actions

  const result = await graphql(`
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
  `)
  if (result.errors) {
    throw result.errors
  }

  // Create post list pages.
  const posts = result.data.allMdx.nodes
  const postsPerPage = 10
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    const currentPage = i + 1
    createPage({
      path: currentPage === 1 ? `/posts` : `/posts/${currentPage}`,
      component: require.resolve(`./src/templates/post-list.tsx`),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage,
      },
    })
  })

  // Create post pages.
  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    createPage({
      path: slug,
      component: require.resolve(`./src/templates/post.tsx`),
      context: { id },
    })
  })
}

const createWorkPages = async (graphql, actions) => {
  const { createPage } = actions

  const result = await graphql(`
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
  `)
  if (result.errors) {
    throw result.errors
  }

  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    createPage({
      path: slug,
      component: require.resolve(`./src/templates/work.tsx`),
      context: { id },
    })
  })
}

const createTagPages = async (graphql, actions) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMdx(sort: { fields: frontmatter___date, order: DESC }) {
        group(field: frontmatter___tags) {
          tag: fieldValue
          totalCount
        }
      }
    }
  `)
  if (result.errors) {
    throw result.errors
  }

  result.data.allMdx.group.forEach(({ tag, totalCount }) => {
    const postsPerPage = 10
    const numPages = Math.ceil(totalCount / postsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      const currentPage = i + 1
      createPage({
        path:
          currentPage === 1 ? `/tags/${tag}` : `/tags/${tag}/${currentPage}`,
        component: require.resolve(`./src/templates/tagged-post-list.tsx`),
        context: {
          tag,
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage,
        },
      })
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  await Promise.all([
    createPostPages(graphql, actions),
    createWorkPages(graphql, actions),
    createTagPages(graphql, actions),
  ])
}
