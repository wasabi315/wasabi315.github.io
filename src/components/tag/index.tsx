import * as React from "react";
import clsx from "clsx";

import * as styles from "./index.module.scss";

type Props = {
  tag: string;
};

const Tag: React.FCX<Props> = ({ className, tag }) => (
  <span className={clsx(className, styles.tag)}>{tag}</span>
);

export default Tag;
