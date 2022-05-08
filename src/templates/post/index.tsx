import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Article from "./article";

type Prop = {
  data: {
    mdx: {
      body: string;
      fields: {
        filePath: string;
      };
      frontmatter: {
        title: string;
        date: string;
        tags: string[];
      };
    };
  };
};

const Post: React.FCX<Prop> = ({ data: { mdx } }) => {
  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} />
      <Article post={mdx} />
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        filePath
      }
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
