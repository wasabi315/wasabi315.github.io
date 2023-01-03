import * as React from "react";
import { Link } from "gatsby";
import clsx from "clsx";

import "../../styles/global.scss";
import * as styles from "./index.module.scss";
import CoolLink from "../cool-link";
import { useScrollY } from "../../hooks/use-scroll";
import wasabi from "../../images/wasabi.svg";

const navigationLinks = [
  { to: `/about/`, label: `About` },
  { to: `/works/`, label: `Works` },
  { to: `/posts/`, label: `Posts` },
] as const;

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const scrollY = useScrollY();

  return (
    <div className={styles.layout}>
      <header className={clsx(scrollY > 0 && styles.show_shadow)}>
        <div>
          <Link to="/">
            <img src={wasabi} />
          </Link>
          <nav>
            <ul>
              {navigationLinks.map(({ to, label }) => (
                <li key={to}>
                  <CoolLink to={to}>{label}</CoolLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        ©2022-{new Date().getFullYear()} wasabi315. Built with {` `}
        <a href="https://www.gatsbyjs.com/" rel="external noopener">
          Gatsby
        </a>
        .
      </footer>
    </div>
  );
};

export default Layout;
