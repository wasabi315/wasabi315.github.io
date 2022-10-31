import * as React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Article from "./article";

type Prop = PageProps<Queries.WorkPageQuery>;

const WorkPage: React.FCX<Prop> = ({ data: { mdx }, children }) => {
  return (
    <Layout>
      <Article work={mdx}>{children}</Article>
    </Layout>
  );
};

export default WorkPage;

export const Head: React.FCX<Prop> = ({ data: { mdx } }) => (
  <Seo title={mdx?.frontmatter?.title ?? `wasabi315's work`} />
);

export const pageQuery = graphql`
  query WorkPage($id: String!) {
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
