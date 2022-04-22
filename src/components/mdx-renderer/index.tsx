import * as React from "react";
import { MDXRenderer as _MDXRenderer } from "gatsby-plugin-mdx";

import * as styles from "./index.module.scss";
import "../../styles/prism-wasabi.css";

type Props = React.ComponentProps<typeof _MDXRenderer>;

const MDXRenderer: React.FCX<Props> = (props) => (
  <section className={styles.markdown}>
    <_MDXRenderer {...props} />
  </section>
);

export default MDXRenderer;
