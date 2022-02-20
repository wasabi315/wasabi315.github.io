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
          date: string
          tags: string[]
        }
      }[]
    }
  }
}

const PostsPage: React.FC<Prop> = ({ data }) => (
  <Layout>
    <Seo title="Posts" />
    <h1 className={styles.title}>Posts</h1>
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

export default PostsPage

export const pageQuery = graphql`
  query {
    allMdx(
      filter: { slug: { regex: "/^posts//" } }
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
