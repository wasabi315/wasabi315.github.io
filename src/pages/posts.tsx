import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./posts.module.scss"

type Prop = {
  data: {
    allMdx: {
      nodes: {
        slug: string
        frontmatter: {
          title: string
        }
      }[]
    }
  }
}

const PostsPage: React.FC<Prop> = ({ data }) => (
  <Layout>
    <Seo title="Posts" />
    <h1 className={styles.title}>Posts</h1>
    <ul>
      {data.allMdx.nodes.map(({ slug, frontmatter }) => (
        <li key={slug}>
          <Link to={`/${slug}`}>{frontmatter.title}</Link>
        </li>
      ))}
    </ul>
  </Layout>
)

export default PostsPage

export const pageQuery = graphql`
  query {
    allMdx(filter: { slug: { regex: "/^posts//" } }) {
      nodes {
        slug
        frontmatter {
          title
        }
      }
    }
  }
`
