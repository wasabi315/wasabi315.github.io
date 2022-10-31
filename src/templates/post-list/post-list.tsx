import * as React from "react";
import { graphql } from "gatsby";

import PostListItem from "./post-list-item";
import Pagination from "../../components/pagination";
import * as styles from "./post-list.module.scss";

type Prop = {
  title: React.ReactNode;
  posts: readonly Queries.PostFragment[];
  pageContext: PaginationContext;
};

const PostList: React.FCX<Prop> = ({ title, posts, pageContext }) => {
  return (
    <section className={styles.post_list}>
      <h1>{title}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post?.fields?.slug}>
            <PostListItem post={post} />
          </li>
        ))}
      </ul>
      <Pagination {...pageContext} prevText="Newer" nextText="Older" />
    </section>
  );
};

export default PostList;

export const query = graphql`
  fragment Post on Mdx {
    fields {
      slug
    }
    frontmatter {
      title
      date(formatString: "YYYY/MM/DD")
      tags
    }
  }
`;
