import * as React from "react"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./post.module.scss"

type Prop = {
  data: {
    mdx: {
      body: string
      frontmatter: {
        title: string
        date: string
        tags: string[]
      }
    }
  }
}

const Post: React.FC<Prop> = ({ data: { mdx } }) => (
  <Layout>
    <Seo title={mdx.frontmatter.title} />
    <h1 className={styles.title}>{mdx.frontmatter.title}</h1>
    <p className={styles.meta}>
      <time>{mdx.frontmatter.date}</time>
      {` - `}
      {mdx.frontmatter.tags.map(tag => (
        <Link key={tag} to={`/tags/` + tag}>
          {tag}
        </Link>
      ))}
    </p>
    <div className="markdown-body">
      <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
    </div>
  </Layout>
)

export default Post

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`
