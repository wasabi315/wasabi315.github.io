import * as React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

import * as style from "./header.module.scss"
import * as config from "./config"

type Prop = {
  siteTitle: string
  onClickMenu?: () => void
}

const navigationLinks = [
  { to: `/works`, label: `Works` },
  { to: `/posts`, label: `Posts` },
]

const Header: React.FCX<Prop> = ({
  className,
  siteTitle = ``,
  onClickMenu,
}) => (
  <header className={className}>
    <nav className={style.header}>
      <div className={style.menu}>
        <FontAwesomeIcon icon={faBars} onClick={onClickMenu} />
      </div>
      <div className={style.title}>
        <Link to="/">{siteTitle}</Link>
      </div>
      <ul className={style.nav}>
        {navigationLinks.map(({ to, label }) => (
          <li key={to} className={style.nav_item}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
      <div className={style.spacer} />
      <ul className={style.nav}>
        {config.socialLinks.map(({ icon, url }) => (
          <li key={url} className={style.nav_item}>
            <a href={url}>
              <FontAwesomeIcon icon={icon} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

export default Header
