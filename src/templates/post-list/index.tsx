import * as React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import PostList from "./post-list";

type Prop = PageProps<Queries.PostListPageQuery> & {
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
  query PostListPage($skip: Int!, $limit: Int!) {
    allMdx(
      filter: { fields: { entryType: { eq: "posts" } } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        ...Post
      }
    }
  }
`;
