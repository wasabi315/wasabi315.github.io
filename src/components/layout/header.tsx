import * as React from "react";
import clsx from "clsx";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { useScrollY } from "../../hooks/use-scroll";
import * as styles from "./header.module.scss";
import * as config from "./config";

type Prop = {
  siteTitle: string;
  onClickMenu?: () => void;
};

const navigationLinks = [
  { to: `/works`, label: `Works` },
  { to: `/posts`, label: `Posts` },
];

const Header: React.FCX<Prop> = ({
  className,
  siteTitle = ``,
  onClickMenu,
}) => {
  const scrollY = useScrollY();
  const showShadow = scrollY > 0;
  return (
    <header
      className={clsx(
        className,
        styles.header,
        showShadow && styles.show_shadow,
      )}
    >
      <nav className={styles.container}>
        <div className={styles.title}>
          <Link to="/">{siteTitle}</Link>
        </div>
        <ul className={styles.nav}>
          {navigationLinks.map(({ to, label }) => (
            <li key={to} className={styles.nav_item}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>
        <div className={styles.spacer} />
        <ul className={styles.nav}>
          {config.socialLinks.map(({ icon, url }) => (
            <li key={url} className={styles.nav_item}>
              <a href={url}>
                <FontAwesomeIcon icon={icon} />
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.menu}>
          <FontAwesomeIcon icon={faBars} onClick={onClickMenu} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
