import * as React from "react";

import * as styles from "./index.module.scss";
import "../../styles/prism-wasabi.css";

type Props = {
  children: undefined;
};

const MDXRenderer: React.FCX<Props> = ({ children }) => (
  <section className={styles.markdown}>{children}</section>
);

export default MDXRenderer;
