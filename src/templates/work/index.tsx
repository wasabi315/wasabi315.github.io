import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import MDXRenderer from "../../components/mdx-renderer";
import ContentGitHubLink from "../../components/content-github-link";
import * as styles from "./index.module.scss";

type Prop = {
  data: {
    mdx: {
      body: string;
      fields: {
        filePath: string;
      };
      frontmatter: {
        title: string;
        description: string;
        featuredImage: ImageDataLike;
      };
    };
  };
};

const Work: React.FCX<Prop> = ({ data: { mdx } }) => {
  const featuredImage = getImage(mdx.frontmatter.featuredImage);
  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} />
      <article>
        <header className={styles.header}>
          <h1 className={styles.title}>{mdx.frontmatter.title}</h1>
          <p className={styles.description}>{mdx.frontmatter.description}</p>
        </header>
        <div className={styles.featured_image_wrapper}>
          {featuredImage && (
            <GatsbyImage
              className={styles.featured_image}
              image={featuredImage}
              alt="featured image"
            />
          )}
        </div>
        <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
        <footer className={styles.footer}>
          <ContentGitHubLink
            className={styles.link}
            filePath={mdx.fields.filePath}
          >
            <FontAwesomeIcon className={styles.icon} icon={faGithubAlt} />
            View the source of this article
          </ContentGitHubLink>
        </footer>
      </article>
    </Layout>
  );
};

export default Work;

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        filePath
      }
      frontmatter {
        title
        description
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 800, height: 450)
          }
        }
      }
    }
  }
`;
