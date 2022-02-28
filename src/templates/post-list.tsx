import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Pagination from "../components/pagination"
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
  return (
    <Layout>
      <Seo title="Posts" />
      <h1 className={styles.title}>Posts</h1>
      <section className={styles.entry}>
        {data.allMdx.nodes.map(({ slug, frontmatter }) => (
          <article key={slug} className={styles.entry_item}>
            <Link className={styles.entry_item_title} to={`/` + slug}>
              {frontmatter.title}
            </Link>
            <p className={styles.entry_item_meta}>
              <time>{frontmatter.date}</time>
              {` - `}
              {frontmatter.tags.map(tag => (
                <Link
                  key={tag}
                  className={styles.entry_item_tag}
                  to={`/tags/` + tag}
                >
                  {tag}
                </Link>
              ))}
            </p>
          </article>
        ))}
      </section>
      <Pagination
        currentPage={pageContext.currentPage}
        numPages={pageContext.numPages}
        createPageLink={page => `/posts/${page === 1 ? `` : page}`}
        prevText="Newer"
        nextText="Older"
      />
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
