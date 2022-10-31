import * as React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import WorkList from "./work-list";

type Prop = PageProps<Queries.WorkListPageQuery> & {
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
  query WorkListPage($skip: Int!, $limit: Int!) {
    allMdx(
      filter: { fields: { entryType: { eq: "works" } } }
      sort: { fields: frontmatter___order, order: ASC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        ...Work
      }
    }
  }
`;
