import * as React from "react"
import { Link } from "gatsby"
import * as style from "./header.module.scss"

type Prop = {
  siteTitle: string
}

const navItems = [
  { to: `/works`, label: `Works` },
  { to: `/posts`, label: `Posts` },
]

const Header: React.FC<Prop> = ({ siteTitle = `` }) => (
  <header>
    <nav className={style.header}>
      <h1 className={style.title}>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <ul className={style.nav}>
        {navItems.map(({ to, label }) => (
          <li key={to} className={style.nav_item}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

export default Header
