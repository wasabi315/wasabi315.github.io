/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import "../../styles/global.scss"
import * as style from "./index.module.scss"
import Header from "./header"
import SideBar from "./side-bar"

const useToggle = (init: boolean) => {
  const [value, setValue] = React.useState(init)
  const setTrue = React.useCallback(() => setValue(true), [])
  const setFalse = React.useCallback(() => setValue(false), [])
  return [value, setTrue, setFalse] as const
}

const Layout: React.FCX = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const [showSideBar, open, close] = useToggle(false)
  const display = showSideBar ? undefined : { display: "none" }

  return (
    <div className={style.container}>
      <Header
        className={style.header}
        siteTitle={data.site.siteMetadata?.title || `Title`}
        onClickMenu={open}
      />
      <SideBar style={display} close={close} />
      <main>{children}</main>
      <footer className={style.footer}>
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
