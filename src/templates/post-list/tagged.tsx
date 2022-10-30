import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Tag from "../../components/tag";
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
  pageContext: PaginationContext & {
    tag: string;
  };
};

const TaggedPostList: React.FCX<Prop> = ({ data, pageContext }) => {
  return (
    <Layout>
      <Seo title={`Tag: ${pageContext.tag}`} />
      <PostList
        title={<Tag tag={pageContext.tag} />}
        posts={data.allMdx.nodes}
        pageContext={pageContext}
      />
    </Layout>
  );
};

export default TaggedPostList;

export const pageQuery = graphql`
  query ($tag: String!, $limit: Int!, $skip: Int!) {
    allMdx(
      filter: {
        fields: { sourceFileType: { eq: "posts" } }
        frontmatter: { tags: { in: [$tag] } }
      }
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
