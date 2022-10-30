import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Article from "./article";

type Prop = {
  data: {
    mdx: {
      frontmatter: {
        title: string;
        date: string;
        tags: string[];
      };
    };
  };
  children: React.ReactNode;
};

const Post: React.FCX<Prop> = ({ data: { mdx }, children }) => {
  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} />
      <Article post={{ ...mdx, body: children }} />
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
