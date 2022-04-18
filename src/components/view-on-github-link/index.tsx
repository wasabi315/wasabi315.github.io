import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import { useSiteMetadata } from "../../hooks/use-site-metadata";
import * as styles from "./index.module.scss";

type Props = {
  filePath: string;
};

const ViewOnGitHubLink: React.FCX<Props> = ({ filePath }) => {
  const { repositoryUrl, headCommitHash } = useSiteMetadata();
  return (
    <a
      target="_blank"
      rel="external noopener noreferrer"
      href={`${repositoryUrl}blob/${headCommitHash}/src/contents${filePath}?plain=1`}
      className={styles.link}
    >
      <FontAwesomeIcon className={styles.icon} icon={faGithubAlt} />
      View on GitHub (Request edit)
    </a>
  );
};

export default ViewOnGitHubLink;
