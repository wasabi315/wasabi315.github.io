import * as React from "react";
import { graphql } from "gatsby";
import { ImageDataLike } from "gatsby-plugin-image";
import { PaginationContext } from "gatsby-awesome-pagination";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import WorkList from "./work-list";

type Prop = {
  data: {
    allMdx: {
      nodes: {
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          thumbnail: ImageDataLike;
          description: string;
        };
      }[];
    };
  };
  pageContext: PaginationContext;
};

const WorkListPage: React.FCX<Prop> = ({ data, pageContext }) => {
  return (
    <Layout>
      <WorkList works={data.allMdx.nodes} pageContext={pageContext} />
    </Layout>
  );
};

export default WorkListPage;

export const Head = () => <Seo title="Works" />;

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMdx(
      filter: { fields: { sourceFileType: { eq: "works" } } }
      sort: { fields: fields___order }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          description
          thumbnail {
            childImageSharp {
              gatsbyImageData(width: 256, height: 320)
            }
          }
        }
      }
    }
  }
`;
