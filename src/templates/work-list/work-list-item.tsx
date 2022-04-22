import * as React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

import * as styles from "./work-list-item.module.scss";

type Props = {
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    thumbnail: ImageDataLike;
    description: string;
  };
};

const WorkListItem: React.FCX<Props> = ({ fields: { slug }, frontmatter }) => {
  const thumbnail = getImage(frontmatter.thumbnail);
  return (
    <article className={styles.entry}>
      <Link to={slug}>
        {thumbnail && (
          <GatsbyImage
            className={styles.entry_image}
            image={thumbnail}
            alt="thumbnail"
          />
        )}
        <h3 className={styles.entry_title}>{frontmatter.title}</h3>
        <p className={styles.entry_description}>{frontmatter.description}</p>
      </Link>
    </article>
  );
};

export default WorkListItem;
