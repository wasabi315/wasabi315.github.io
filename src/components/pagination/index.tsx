import * as React from "react";
import { Link } from "gatsby";
import clsx from "clsx";

import * as styles from "./index.module.scss";

type Prop = {
  currentPage: number;
  numPages: number;
  buildPageLink: (page: number) => string;
  prevText?: string;
  nextText?: string;
};

const Pagination: React.FCX<Prop> = ({
  currentPage,
  numPages,
  buildPageLink,
  prevText = `Prev`,
  nextText = `Next`,
}) => {
  const prevPageLink = buildPageLink(Math.max(currentPage - 1, 1));
  const nextPageLink = buildPageLink(Math.min(currentPage + 1, numPages));
  const noPrevPage = currentPage === 1;
  const noNextPage = currentPage === numPages;
  return (
    <div className={styles.pagination}>
      <Link to={prevPageLink} className={clsx(noPrevPage && styles.disabled)}>
        {prevText}
      </Link>
      <span>
        Page {currentPage} of {numPages}
      </span>
      <Link to={nextPageLink} className={clsx(noNextPage && styles.disabled)}>
        {nextText}
      </Link>
    </div>
  );
};

export default Pagination;
