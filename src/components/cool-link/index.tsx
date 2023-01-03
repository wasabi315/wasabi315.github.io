import * as React from "react";
import { GatsbyLinkProps, Link } from "gatsby";

import * as styles from "./index.module.scss";

type Props = Omit<GatsbyLinkProps<unknown>, "activeClassName" | "activeStyle">;

const CoolLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ to, children }, ref) => {
    return (
      <Link
        ref={ref as any}
        to={to}
        className={styles.link}
        activeClassName={styles.active}
      >
        {children}
      </Link>
    );
  },
);

export default CoolLink;
