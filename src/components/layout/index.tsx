/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import "../../styles/global.scss"
import * as styles from "./index.module.scss"
import Header from "./header"
import SideBar from "./side-bar"
import { useSiteMetadata } from "../../hooks/use-site-metadata"

const useToggle = (init: boolean) => {
  const [value, setValue] = React.useState(init)
  const setTrue = React.useCallback(() => setValue(true), [])
  const setFalse = React.useCallback(() => setValue(false), [])
  return [value, setTrue, setFalse] as const
}

const Layout: React.FCX = ({ children }) => {
  const { title } = useSiteMetadata()
  const [showSideBar, open, close] = useToggle(false)

  return (
    <div className={styles.container}>
      <Header className={styles.header} siteTitle={title} onClickMenu={open} />
      <SideBar showSideBar={showSideBar} close={close} />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Satoshi Takimoto.
        <span>
          Built with {` `}
          <a rel="external" href="https://www.gatsbyjs.org">
            Gatsby
          </a>
        </span>
      </footer>
    </div>
  )
}

export default Layout
