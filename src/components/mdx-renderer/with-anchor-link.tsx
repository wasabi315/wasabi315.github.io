import * as React from "react"
import { Link } from "gatsby"

import * as styles from "./with-anchor-link.module.scss"

type Props = {
  children: string
  id?: string
  className?: string
}

const withAnchorLink = <P extends Props = Props>(
  WrappedElement: React.ElementType<P>
): React.ComponentType<P> => {
  return props =>
    React.createElement(
      WrappedElement,
      {
        ...props,
        id: props.children,
        className: `${styles.has_anchor_link} ${props.className ?? ``}`,
      },
      [<Link to={`#${props.children}`} />, props.children]
    )
}

export default withAnchorLink
