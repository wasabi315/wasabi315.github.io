import * as React from "react";
import { graphql } from "gatsby";
import { PaginationContext } from "gatsby-awesome-pagination";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import PostList from "./post-list";

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
      <PostList
        title="Posts"
        posts={data.allMdx.nodes}
        pageContext={pageContext}
      />
    </Layout>
  );
};

export default PostListPage;

export const Head = () => <Seo title="Posts" />;

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
