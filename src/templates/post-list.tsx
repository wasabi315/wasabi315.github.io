import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./post-list.module.scss"

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
    numPages: number
    currentPage: number
  }
}

const PostListPage: React.FCX<Prop> = ({ data, pageContext }) => {
  const prevPage = Math.max(pageContext.currentPage - 1, 1)
  const nextPage = Math.min(pageContext.currentPage + 1, pageContext.numPages)
  const prevPageLink = `/posts/${prevPage === 1 ? `` : prevPage}`
  const nextPageLink = `/posts/${nextPage === 1 ? `` : nextPage}`
  return (
    <Layout>
      <Seo title="Posts" />
      <h1 className={styles.title}>Posts</h1>
      <section className={styles.entry_list}>
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
      <section className={styles.nav}>
        <Link to={prevPageLink}>Newer</Link>
        <span>
          Page {pageContext.currentPage} of {pageContext.numPages}
        </span>
        <Link to={nextPageLink}>Older</Link>
      </section>
    </Layout>
  )
}

export default PostListPage

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMdx(
      filter: { slug: { regex: "/^posts//" } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
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
