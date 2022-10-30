import * as React from "react";
import { ImageDataLike } from "gatsby-plugin-image";

import Pagination from "../../components/pagination";
import WorkListItem from "./work-list-item";
import * as styles from "./work-list.module.scss";

type Prop = {
  works: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
      thumbnail: ImageDataLike;
      description: string;
    };
  }[];
  pageContext: PaginationContext;
};

const WorkList: React.FCX<Prop> = ({ works, pageContext }) => {
  return (
    <section className={styles.work_list}>
      <h1>Works</h1>
      <ul>
        {works.map((work) => (
          <li key={work.fields.slug}>
            <WorkListItem work={work} />
          </li>
        ))}
      </ul>
      <Pagination {...pageContext} />
    </section>
  );
};

export default WorkList;
