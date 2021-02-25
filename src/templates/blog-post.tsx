import React from "react"
import { PageProps, graphql } from "gatsby"

type Props = PageProps<GatsbyTypes.BlogTemplateQuery>

const BlogTemplate: React.FC<Props> = ({ data }) => {
  const { markdownRemark } = data
  return (
    <div>
      <div>
        <h1>{markdownRemark?.frontmatter?.title}</h1>
        <h2>{markdownRemark?.frontmatter?.date}</h2>
        <div dangerouslySetInnerHTML={{ __html: markdownRemark?.html ?? `` }} />
      </div>
    </div>
  )
}

export default BlogTemplate

export const pageQuery = graphql`
  query BlogTemplate($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
