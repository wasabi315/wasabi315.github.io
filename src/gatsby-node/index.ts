import path from "path"
import { GatsbyNode } from "gatsby"

export const createPages: GatsbyNode["createPages"] = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  // FIXME: Better typing
  const result = await graphql<GatsbyTypes.Query>(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`, result.errors)
    return
  }

  result?.data?.allMarkdownRemark?.edges?.forEach(({ node }) => {
    if (node?.frontmatter?.path) {
      createPage({
        path: node.frontmatter.path,
        component: path.resolve(`src/templates/blog-post.tsx`),
        context: {},
      })
    }
  })
}
