import * as React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGithubAlt,
  faGitlab,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"

import * as style from "./header.module.scss"

type Prop = {
  siteTitle: string
}

const navItems = [
  { to: `/works`, label: `Works` },
  { to: `/posts`, label: `Posts` },
]

const socialItems = [
  { icon: faGithubAlt, url: `https://github.com/wasabi315` },
  { icon: faGitlab, url: `https://gitlab.com/wasabi315` },
  { icon: faTwitter, url: `https://twitter.com/wasabi65255737` },
]

const Header: React.FCX<Prop> = ({ className, siteTitle = `` }) => (
  <header className={className}>
    <nav className={style.header}>
      <div className={style.title}>
        <Link to="/">{siteTitle}</Link>
      </div>
      <ul className={style.nav}>
        {navItems.map(({ to, label }) => (
          <li key={to} className={style.nav_item}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
      <div className={style.spacer} />
      <ul className={style.nav}>
        {socialItems.map(({ icon, url }) => (
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
