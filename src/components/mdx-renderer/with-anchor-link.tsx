import * as React from "react"
import { Link } from "gatsby"
import clsx from "clsx"

import * as styles from "./with-anchor-link.module.scss"

const withAnchorLink = (
  WrappedElement: React.ElementType<any>
): React.FCX<{ children: string }> => {
  return props => (
    <WrappedElement
      id={props.children}
      className={clsx(styles.anchor_link, props.className)}
    >
      <Link to={`#${props.children}`} />
      {props.children}
    </WrappedElement>
  )
}

export default withAnchorLink
