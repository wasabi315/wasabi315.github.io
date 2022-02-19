const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
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
