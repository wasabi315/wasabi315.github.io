import * as React from "react";

import "../../styles/global.scss";
import * as styles from "./index.module.scss";
import Header from "./header";
import SideBar from "./side-bar";
import { useSiteMetadata } from "../../hooks/use-site-metadata";
import { useFlag } from "../../hooks/use-flag";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FCX<Props> = ({ children }) => {
  const { title } = useSiteMetadata();
  const { flag: showSideBar, set: open, clear: close } = useFlag(false);

  return (
    <div className={styles.layout}>
      <Header siteTitle={title} onClickMenu={open} />
      <SideBar showSideBar={showSideBar} close={close} />
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} Satoshi Takimoto.
        <span>
          Built with {` `}
          <a href="https://www.gatsbyjs.com/">Gatsby</a>
        </span>
      </footer>
    </div>
  );
};

export default Layout;
