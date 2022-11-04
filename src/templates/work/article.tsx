import * as React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import MDXRenderer from "../../components/mdx-renderer";
import Comment from "../../components/comment";
import * as styles from "./article.module.scss";

type Prop = {
  work: Queries.WorkPageQuery["mdx"];
  children: undefined;
};

const Article: React.FCX<Prop> = ({ work, children }) => {
  const featuredImage = getImage(
    (work?.frontmatter?.featuredImage as unknown) ?? null,
  );
  return (
    <article className={styles.article}>
      <header>
        <h1>{work?.frontmatter?.title}</h1>
        <p>{work?.frontmatter?.description}</p>
      </header>
      <figure>
        {featuredImage && (
          <GatsbyImage
            className={styles.featured_image}
            image={featuredImage}
            alt="featured image"
          />
        )}
      </figure>
      <MDXRenderer>{children}</MDXRenderer>
      {work?.frontmatter?.githubRepository && (
        <a href={`https://github.com/${work.frontmatter.githubRepository}`}>
          <FontAwesomeIcon icon={faGithubAlt} size="lg" />
          {` `}
          View this work on GitHub
        </a>
      )}
      <footer>
        <Comment />
      </footer>
    </article>
  );
};

export default Article;
