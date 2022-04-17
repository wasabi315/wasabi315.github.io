import * as React from "react";
import { Link } from "gatsby";
import clsx from "clsx";

import * as styles from "./index.module.scss";

type Prop = {
  previousPagePath: string;
  nextPagePath: string;
  numberOfPages: number;
  humanPageNumber: number;
  prevText?: string;
  nextText?: string;
};

const Pagination: React.FCX<Prop> = ({
  previousPagePath,
  nextPagePath,
  numberOfPages,
  humanPageNumber,
  prevText = `Prev`,
  nextText = `Next`,
}) => {
  return (
    <div className={styles.pagination}>
      <Link
        to={previousPagePath}
        className={clsx(!previousPagePath && styles.disabled)}
      >
        {prevText}
      </Link>
      <span>
        Page {humanPageNumber} of {numberOfPages}
      </span>
      <Link
        to={nextPagePath}
        className={clsx(!nextPagePath && styles.disabled)}
      >
        {nextText}
      </Link>
    </div>
  );
};

export default Pagination;
