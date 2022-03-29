import * as React from "react";

import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "./404.module.scss";

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Not found" />
    <h1 className={styles.title}>404: Not Found</h1>
    <p className={styles.content}>
      You just hit a route that doesn&#39;t exist... the sadness.
    </p>
  </Layout>
);

export default NotFoundPage;
