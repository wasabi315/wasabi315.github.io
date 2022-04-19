import * as React from "react";
import { Link, graphql } from "gatsby";
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
        date: string;
        tags: string[];
      };
    };
  };
};

const Post: React.FCX<Prop> = ({ data: { mdx } }) => {
  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} />
      <article>
        <header>
          <h1 className={styles.title}>{mdx.frontmatter.title}</h1>
          <p className={styles.meta}>
            <time>{mdx.frontmatter.date}</time>
            {` - `}
            {mdx.frontmatter.tags.map((tag) => (
              <Link key={tag} className={styles.tag} to={`/tags/${tag}`}>
                {tag}
              </Link>
            ))}
          </p>
        </header>
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

export default Post;

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        filePath
      }
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
    }
  }
`;
