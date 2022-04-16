import * as React from "react";
import { graphql } from "gatsby";
import { ImageDataLike } from "gatsby-plugin-image";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Pagination from "../../components/pagination";
import WorkListItem from "./work-list-item";
import buildPaginatedUrl from "../../util/build-paginated-url";
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
          thumbnail: ImageDataLike;
        };
      }[];
    };
  };
  pageContext: {
    numPages: number;
    currentPage: number;
  };
};

const WorkListPage: React.FCX<Prop> = ({ data, pageContext }) => {
  return (
    <Layout>
      <Seo title="Works" />
      <h1 className={styles.title}>Works</h1>
      <div className={styles.entry}>
        {data.allMdx.nodes.map((node) => (
          <WorkListItem key={node.fields.slug} {...node} />
        ))}
      </div>
      <Pagination
        currentPage={pageContext.currentPage}
        numPages={pageContext.numPages}
        buildPageLink={(page) => buildPaginatedUrl(`/works`, page)}
      />
    </Layout>
  );
};

export default WorkListPage;

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
