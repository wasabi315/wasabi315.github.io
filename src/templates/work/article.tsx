import * as React from "react";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import MDXRenderer from "../../components/mdx-renderer";
import Comment from "../../components/comment";
import * as styles from "./article.module.scss";

type Prop = {
  work: {
    frontmatter: {
      title: string;
      description: string;
      githubRepository?: string;
      featuredImage: ImageDataLike;
    };
    body: React.ReactNode;
  };
};

const Article: React.FCX<Prop> = ({ work }) => {
  const featuredImage = getImage(work.frontmatter.featuredImage);
  return (
    <article className={styles.article}>
      <header>
        <div>
          <h1>{work.frontmatter.title}</h1>
          {work.frontmatter.githubRepository && (
            <a href={`https://github.com/${work.frontmatter.githubRepository}`}>
              <FontAwesomeIcon icon={faGithubAlt} />
              {` `}
              View on GitHub
            </a>
          )}
        </div>
        <p>{work.frontmatter.description}</p>
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
      <MDXRenderer>{work.body}</MDXRenderer>
      <footer>
        <Comment />
      </footer>
    </article>
  );
};

export default Article;
