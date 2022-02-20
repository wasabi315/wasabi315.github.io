import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./tags.module.scss"

type Prop = {
  data: {
    allMdx: {
      nodes: {
        slug: string
        frontmatter: {
          title: string
          date: string
          tags: string[]
        }
      }[]
    }
  }
  pageContext: {
    tag: string
  }
}

const Tags: React.FC<Prop> = ({ data, pageContext }) => (
  <Layout>
    <Seo title={`Tag: ${pageContext.tag}`} />
    <h1 className={styles.title}>{pageContext.tag}</h1>
    <section>
      {data.allMdx.nodes.map(({ slug, frontmatter }) => (
        <article key={slug} className={styles.entry}>
          <Link to={`/` + slug}>{frontmatter.title}</Link>
          <p>
            <time>{frontmatter.date}</time>
            {` - `}
            {frontmatter.tags.map(tag => (
              <Link key={tag} to={`/tags/` + tag}>
                {tag}
              </Link>
            ))}
          </p>
        </article>
      ))}
    </section>
  </Layout>
)

export default Tags

export const pageQuery = graphql`
  query ($tag: String!) {
    allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        slug
        frontmatter {
          title
          date(formatString: "YYYY/MM/DD")
          tags
        }
      }
    }
  }
`
