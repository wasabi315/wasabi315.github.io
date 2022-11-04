import * as React from "react";
import clsx from "clsx";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import * as styles from "./side-bar.module.scss";
import * as config from "./config";

type Prop = {
  showSideBar: boolean;
  close: () => void;
};

const SideBar: React.FCX<Prop> = ({ showSideBar, close }) => {
  const showSideBarClass = showSideBar && styles.show;
  return (
    <>
      <aside className={clsx(styles.side_bar, showSideBarClass)}>
        <button>
          <FontAwesomeIcon icon={faXmark} onClick={close} />
        </button>
        <nav>
          <ul className={styles.nav}>
            {config.navigationLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.social}>
            {config.socialLinks.map(({ icon, url }) => (
              <li key={url}>
                <a href={url}>
                  <FontAwesomeIcon icon={icon} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p>
          © {new Date().getFullYear()} Satoshi Takimoto.
          <br />
          Built with {` `}
          <a href="https://www.gatsbyjs.com/">Gatsby</a>
        </p>
      </aside>
      <div className={clsx(styles.mask, showSideBarClass)} onClick={close} />
    </>
  );
};

export default SideBar;
