const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMdx {
        edges {
          node {
            id
            slug
          }
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
  result.data.allMdx.edges.forEach(({ node }) => {
    const template = templates[path.dirname(node.slug)]
    if (!template) {
      reporter.panicOnBuild(`No template found for ${node.slug}`)
      return
    }
    createPage({
      path: node.slug,
      component: template,
      context: {
        id: node.id,
      },
    })
  })
}
