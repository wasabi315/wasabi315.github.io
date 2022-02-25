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

  return (
    <div className={style.container}>
      <Header
        className={style.header}
        siteTitle={data.site.siteMetadata?.title || `Title`}
      />
      <main>{children}</main>
      <footer className={style.footer}>
        © {new Date().getFullYear()} Satoshi Takimoto. All rights reserved.
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
