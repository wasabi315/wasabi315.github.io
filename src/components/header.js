import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import * as style from "./header.module.css"

const Header = ({ siteTitle }) => (
  <header className={style.header}>
    <div className={style.container}>
      <h1 className={style.title}>
        <Link to="/" className={style.link_text}>
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
