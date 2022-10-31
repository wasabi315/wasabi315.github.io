import * as React from "react";
import { graphql } from "gatsby";
import { ImageDataLike } from "gatsby-plugin-image";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Article from "./article";

type Prop = {
  data: {
    mdx: {
      frontmatter: {
        title: string;
        description: string;
        githubRepository?: string;
        featuredImage: ImageDataLike;
      };
    };
  };
  children: React.ReactNode;
};

const Work: React.FCX<Prop> = ({ data: { mdx }, children }) => {
  return (
    <Layout>
      <Article work={{ ...mdx, body: children }} />
    </Layout>
  );
};

export default Work;

export const Head: React.FCX<Prop> = ({ data: { mdx } }) => (
  <Seo title={mdx.frontmatter.title} />
);

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        description
        githubRepository
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 800, height: 450)
          }
        }
      }
    }
  }
`;
