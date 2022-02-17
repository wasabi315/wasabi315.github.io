import * as React from "react"
import { Link } from "gatsby"
import * as style from "./header.module.scss"

type Prop = {
  siteTitle: string
}

const Header: React.FC<Prop> = ({ siteTitle = `` }) => (
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

export default Header
