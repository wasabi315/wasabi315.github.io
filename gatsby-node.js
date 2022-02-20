const path = require(`path`)

const createEntryPages = async (graphql, actions, reporter) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMdx {
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

  const templates = {
    posts: require.resolve(`./src/templates/post.tsx`),
    works: require.resolve(`./src/templates/work.tsx`),
  }
  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    const template = templates[path.dirname(slug)]
    if (!template) {
      reporter.panicOnBuild(`No template found for ${slug}`)
      return
    }
    createPage({
      path: slug,
      component: template,
      context: { id },
    })
  })
}

const createTagPages = async (graphql, actions) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMdx {
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

  result.data.allMdx.group.forEach(({ tag }) => {
    createPage({
      path: `/tags/${tag}/`,
      component: require.resolve(`./src/templates/tags.tsx`),
      context: { tag },
    })
  })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  await createEntryPages(graphql, actions, reporter)
  await createTagPages(graphql, actions)
}
