import { graphql, useStaticQuery } from "gatsby";

type SiteMetadata = {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  repositoryUrl: string;
  headCommitHash: string;
};

export const useSiteMetadata = (): SiteMetadata => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetadata {
        site {
          siteMetadata {
            title
            author
            description
            siteUrl
            repositoryUrl
            headCommitHash
          }
        }
      }
    `,
  );
  return site.siteMetadata;
};
