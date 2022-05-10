import * as React from "react";

import { useSiteMetadata } from "../../hooks/use-site-metadata";

type Props = Omit<React.ComponentProps<`a`>, `href`> & {
  filePath: string;
  range?: { start: number; end: number };
};

const ContentSourceLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ filePath, range, ...props }, ref) => {
    const { repositoryUrl, headCommitHash } = useSiteMetadata();

    const link = `${repositoryUrl}blob/${headCommitHash}/src/contents${filePath}?plain=1`;
    const linkWithRange =
      link + (range ? `#L${range.start}-L${range.end}` : ``);

    return <a {...props} ref={ref} href={linkWithRange} />;
  },
);

export default ContentSourceLink;
