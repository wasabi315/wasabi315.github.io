import * as React from "react";
import { graphql } from "gatsby";

import Pagination from "../../components/pagination";
import WorkListItem from "./work-list-item";
import * as styles from "./work-list.module.scss";

type Prop = {
  works: readonly Queries.WorkFragment[];
  pageContext: PaginationContext;
};

const WorkList: React.FCX<Prop> = ({ works, pageContext }) => {
  return (
    <section className={styles.work_list}>
      <h1>Works</h1>
      <ul>
        {works.map((work) => (
          <li key={work?.fields?.slug}>
            <WorkListItem work={work} />
          </li>
        ))}
      </ul>
      <Pagination {...pageContext} />
    </section>
  );
};

export default WorkList;

export const query = graphql`
  fragment Work on Mdx {
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
`;
