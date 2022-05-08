import * as React from "react";
import { Link } from "gatsby";

import Tag from "../../components/tag";
import * as styles from "./post-list-item.module.scss";

type Props = {
  post: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
      date: string;
      tags: string[];
    };
  };
};

const PostListItem: React.FCX<Props> = ({ post }) => (
  <article className={styles.entry}>
    <h3>
      <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
    </h3>
    <p>
      <time>{post.frontmatter.date}</time>
      {` - `}
      {post.frontmatter.tags.map((tag) => (
        <Link key={tag} to={`/tags/${tag}`}>
          <Tag tag={tag} />
        </Link>
      ))}
    </p>
  </article>
);

export default PostListItem;
