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
    featuredImage: ImageDataLike;
  };
};

const WorkListItem: React.FCX<Props> = ({ fields: { slug }, frontmatter }) => {
  const featuredImage = getImage(frontmatter.featuredImage);
  return (
    <article className={styles.entry_item}>
      <Link to={slug}>
        {featuredImage && (
          <GatsbyImage
            className={styles.entry_item_image}
            image={featuredImage}
            alt="featured image"
          />
        )}
        <h3 className={styles.entry_item_title}>{frontmatter.title}</h3>
      </Link>
    </article>
  );
};

export default WorkListItem;
