import * as React from "react";
import { Link } from "gatsby";

import MDXRenderer from "../../components/mdx-renderer";
import Tag from "../../components/tag";
import Comment from "../../components/comment";
import * as styles from "./article.module.scss";

type Props = {
  post: {
    frontmatter: {
      title: string;
      date: string;
      tags: string[];
    };
    body: React.ReactNode;
  };
};

const Article: React.FCX<Props> = ({ post }) => {
  return (
    <article className={styles.article}>
      <header>
        <h1>{post.frontmatter.title}</h1>
        <p>
          <time>{post.frontmatter.date}</time>
          {` - `}
          {post.frontmatter.tags.map((tag) => (
            <Link key={tag} to={`/tags/${tag}`}>
              <Tag tag={tag} />
            </Link>
          ))}
        </p>
      </header>
      <MDXRenderer>{post.body}</MDXRenderer>
      <footer>
        <Comment />
      </footer>
    </article>
  );
};

export default Article;
