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
  const { site, gitCommit } = useStaticQuery<Queries.SiteMetadataQuery>(
    graphql`
      query SiteMetadata {
        site {
          siteMetadata {
            title
            author
            description
            siteUrl
            repositoryUrl
          }
        }
        gitCommit(latest: { eq: true }) {
          hash
        }
      }
    `,
  );
  return { ...site!.siteMetadata, headCommitHash: gitCommit?.hash! };
};
