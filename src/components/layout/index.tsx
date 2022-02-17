/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import "../../styles/theme.scss"
import "./layout.scss"
import Header from "./header"
import * as style from "./index.module.scss"

const Layout: React.FC = ({ children }) => {
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
    <>
      <div className={style.container}>
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>{children}</main>
        <footer className={style.footer}>
          © {new Date().getFullYear()}, Built with Gatsby
        </footer>
      </div>
    </>
  )
}

export default Layout
