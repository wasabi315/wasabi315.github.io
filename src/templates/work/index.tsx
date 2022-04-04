import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import MDXRenderer from "../../components/mdx-renderer";
import * as styles from "./index.module.scss";

type Prop = {
  data: {
    mdx: {
      body: string;
      frontmatter: {
        title: string;
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
        <header>
          <h1 className={styles.title}>{mdx.frontmatter.title}</h1>
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
      </article>
    </Layout>
  );
};

export default Work;

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 800)
          }
        }
      }
    }
  }
`;
