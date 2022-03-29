import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHelmetSafety } from "@fortawesome/free-solid-svg-icons";

import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "./works.module.scss";

const WorksPage = () => (
  <Layout>
    <Seo title="Works" />
    <h1 className={styles.title}>Works</h1>
    <p className={styles.body}>
      <FontAwesomeIcon icon={faHelmetSafety} />
      {` `}
      Under Construction
      {` `}
      <FontAwesomeIcon icon={faHelmetSafety} />
    </p>
  </Layout>
);

export default WorksPage;
