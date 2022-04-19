import * as React from "react";
import { useSiteMetadata } from "../../hooks/use-site-metadata";

type Props = Omit<JSX.IntrinsicElements[`a`], `target` | `rel` | `href`> & {
  filePath: string;
  range?: { start: number; end: number };
};

const ContentGitHubLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ filePath, range, ...props }, ref) => {
    const { repositoryUrl, headCommitHash } = useSiteMetadata();
    const link = React.useMemo(() => {
      const url = `${repositoryUrl}blob/${headCommitHash}/src/contents${filePath}?plain=1`;
      return range ? `${url}#L${range.start}-L${range.end}` : url;
    }, [filePath, headCommitHash, repositoryUrl, range]);
    return (
      <a
        {...props}
        ref={ref}
        target="_blank"
        rel="external noopener noreferrer"
        href={link}
      />
    );
  },
);

export default ContentGitHubLink;
