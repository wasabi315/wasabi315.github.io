import * as React from "react"
import { graphql } from "gatsby"
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
      }
    }
  }
}

const Work: React.FCX<Prop> = ({ data: { mdx } }) => (
  <Layout>
    <Seo title={mdx.frontmatter.title} />
    <h1 className={styles.title}>{mdx.frontmatter.title}</h1>
    <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
  </Layout>
)

export default Work

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
      }
    }
  }
`
