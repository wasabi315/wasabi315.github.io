import * as React from "react";
import { graphql } from "gatsby";
import { PaginationContext } from "gatsby-awesome-pagination";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import PostListItem from "./post-list-item";
import Pagination from "../../components/pagination";
import * as styles from "./tagged.module.scss";

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
      <h1 className={styles.title}>{pageContext.tag}</h1>
      <div className={styles.post_list}>
        {data.allMdx.nodes.map((post) => (
          <PostListItem key={post.fields.slug} {...post} />
        ))}
      </div>
      <Pagination {...pageContext} prevText="Newer" nextText="Older" />
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
