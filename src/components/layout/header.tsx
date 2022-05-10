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

const Header: React.FCX<Prop> = ({ siteTitle = ``, onClickMenu }) => {
  const scrollY = useScrollY();

  return (
    <header className={clsx(styles.header, scrollY > 0 && styles.show_shadow)}>
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <nav>
        <ul>
          {navigationLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>
        <ul>
          {config.socialLinks.map(({ icon, url }) => (
            <li key={url}>
              <a href={url}>
                <FontAwesomeIcon icon={icon} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={onClickMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </header>
  );
};

export default Header;
