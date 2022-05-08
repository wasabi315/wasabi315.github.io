import * as React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

import * as styles from "./work-list-item.module.scss";

type Props = {
  work: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
      thumbnail: ImageDataLike;
      description: string;
    };
  };
};

const WorkListItem: React.FCX<Props> = ({ work }) => {
  const thumbnail = getImage(work.frontmatter.thumbnail);
  return (
    <article className={styles.entry}>
      <Link to={work.fields.slug}>
        {thumbnail && (
          <GatsbyImage
            className={styles.thumbnail}
            image={thumbnail}
            alt="thumbnail"
          />
        )}
        <h3>{work.frontmatter.title}</h3>
        <p>{work.frontmatter.description}</p>
      </Link>
    </article>
  );
};

export default WorkListItem;
