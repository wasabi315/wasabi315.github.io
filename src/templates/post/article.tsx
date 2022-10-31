import * as React from "react";
import { Link } from "gatsby";

import MDXRenderer from "../../components/mdx-renderer";
import Tag from "../../components/tag";
import Comment from "../../components/comment";
import * as styles from "./article.module.scss";

type Props = {
  post: Queries.PostPageQuery["mdx"];
  children: undefined;
};

const Article: React.FCX<Props> = ({ post, children }) => {
  return (
    <article className={styles.article}>
      <header>
        <h1>{post?.frontmatter?.title}</h1>
        <p>
          <time>{post?.frontmatter?.date}</time>
          {` - `}
          {post?.frontmatter?.tags?.map(
            (tag) =>
              tag && (
                <Link key={tag} to={`/tags/${tag}`}>
                  <Tag tag={tag} />
                </Link>
              ),
          )}
        </p>
      </header>
      <MDXRenderer>{children}</MDXRenderer>
      <footer>
        <Comment />
      </footer>
    </article>
  );
};

export default Article;
