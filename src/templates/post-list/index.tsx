import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import PostListItem from "./post-list-item"
import Pagination from "../../components/pagination"
import * as styles from "./index.module.scss"
import buildPaginatedUrl from "../../util/build-paginated-url"

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
      <div className={styles.post_list}>
        {data.allMdx.nodes.map(post => (
          <PostListItem key={post.slug} {...post} />
        ))}
      </div>
      <Pagination
        currentPage={pageContext.currentPage}
        numPages={pageContext.numPages}
        buildPageLink={page => buildPaginatedUrl(`/posts`, page)}
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
