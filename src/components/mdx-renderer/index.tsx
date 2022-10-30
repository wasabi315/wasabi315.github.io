import * as React from "react";

import * as styles from "./index.module.scss";
import "../../styles/prism-wasabi.css";

const MDXRenderer: React.FCX = ({ children }) => (
  <section className={styles.markdown}>{children}</section>
);

export default MDXRenderer;
