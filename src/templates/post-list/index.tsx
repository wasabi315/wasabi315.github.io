import * as React from "react";
import { graphql } from "gatsby";
import { PaginationContext } from "gatsby-awesome-pagination";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import PostListItem from "./post-list-item";
import Pagination from "../../components/pagination";
import * as styles from "./index.module.scss";

type Prop = {
  data: {
    allMdx: {
      nodes: {
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          date: string;
          tags: string[];
        };
      }[];
    };
  };
  pageContext: PaginationContext;
};

const PostListPage: React.FCX<Prop> = ({ data, pageContext }) => {
  return (
    <Layout>
      <Seo title="Posts" />
      <h1 className={styles.title}>Posts</h1>
      <div className={styles.post_list}>
        {data.allMdx.nodes.map((post) => (
          <PostListItem key={post.fields.slug} {...post} />
        ))}
      </div>
      <Pagination {...pageContext} prevText="Newer" nextText="Older" />
    </Layout>
  );
};

export default PostListPage;

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMdx(
      filter: { fields: { sourceFileType: { eq: "posts" } } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY/MM/DD")
          tags
        }
      }
    }
  }
`;
