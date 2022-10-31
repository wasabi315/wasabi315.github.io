import * as React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Tag from "../../components/tag";
import PostList from "./post-list";

type Prop = PageProps<Queries.PostListPageQuery> & {
  pageContext: PaginationContext & {
    tag: string;
  };
};

const TaggedPostListPage: React.FCX<Prop> = ({ data, pageContext }) => {
  return (
    <Layout>
      <PostList
        title={<Tag tag={pageContext.tag} />}
        posts={data.allMdx.nodes}
        pageContext={pageContext}
      />
    </Layout>
  );
};

export default TaggedPostListPage;

export const Head: React.FCX<Prop> = ({ pageContext }) => (
  <Seo title={`Tag: ${pageContext.tag}`} />
);

export const pageQuery = graphql`
  query TaggedPostListPage($tag: String!, $limit: Int!, $skip: Int!) {
    allMdx(
      filter: {
        fields: { entryType: { eq: "posts" } }
        frontmatter: { tags: { in: [$tag] } }
      }
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
