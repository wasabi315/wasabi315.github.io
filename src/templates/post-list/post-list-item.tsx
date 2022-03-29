import * as React from "react"
import { Link } from "gatsby"

import * as styles from "./post-list-item.module.scss"

type Props = {
  slug: string
  frontmatter: {
    title: string
    date: string
    tags: string[]
  }
}

const PostListItem: React.FCX<Props> = ({ slug, frontmatter }) => (
  <article className={styles.entry_item}>
    <Link className={styles.entry_item_title} to={`/${slug}`}>
      {frontmatter.title}
    </Link>
    <p className={styles.entry_item_meta}>
      <time>{frontmatter.date}</time>
      {` - `}
      {frontmatter.tags.map(tag => (
        <Link key={tag} className={styles.entry_item_tag} to={`/tags/${tag}`}>
          {tag}
        </Link>
      ))}
    </p>
  </article>
)

export default PostListItem
