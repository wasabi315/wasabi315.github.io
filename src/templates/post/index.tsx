import * as React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import Article from "./article";

type Prop = PageProps<Queries.PostPageQuery>;

const PostPage: React.FCX<Prop> = ({ data: { mdx }, children }) => {
  return (
    <Layout>
      <Article post={mdx}>{children}</Article>
    </Layout>
  );
};

export default PostPage;

export const Head: React.FCX<Prop> = ({ data: { mdx } }) => (
  <Seo title={mdx?.frontmatter?.title ?? `wasabi315's post`} />
);

export const pageQuery = graphql`
  query PostPage($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
