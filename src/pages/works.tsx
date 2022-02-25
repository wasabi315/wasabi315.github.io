import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./works.module.scss"

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

const WorksPage: React.FCX<Prop> = ({ data }) => (
  <Layout>
    <Seo title="Works" />
    <h1 className={styles.title}>Works</h1>
    <ul>
      {data.allMdx.nodes.map(({ slug, frontmatter }) => (
        <li key={slug}>
          <Link to={`/${slug}`}>{frontmatter.title}</Link>
        </li>
      ))}
    </ul>
  </Layout>
)

export default WorksPage

export const pageQuery = graphql`
  query {
    allMdx(filter: { slug: { regex: "/^works//" } }) {
      nodes {
        slug
        frontmatter {
          title
        }
      }
    }
  }
`
