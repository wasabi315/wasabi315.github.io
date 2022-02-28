import * as React from "react"
import { Link } from "gatsby"

import * as styles from "./index.module.scss"

type Prop = {
  currentPage: number
  numPages: number
  createPageLink: (page: number) => string
  prevText?: string
  nextText?: string
}

const Pagination: React.FCX<Prop> = ({
  currentPage,
  numPages,
  createPageLink,
  prevText = `Prev`,
  nextText = `Next`,
}) => {
  const prevPageLink = createPageLink(Math.max(currentPage - 1, 1))
  const nextPageLink = createPageLink(Math.min(currentPage + 1, numPages))
  return (
    <div className={styles.pagination}>
      <Link to={prevPageLink}>{prevText}</Link>
      <span>
        Page {currentPage} of {numPages}
      </span>
      <Link to={nextPageLink}>{nextText}</Link>
    </div>
  )
}

export default Pagination
