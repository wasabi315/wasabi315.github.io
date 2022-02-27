import * as React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import * as styles from "./side-bar.module.scss"
import * as config from "./config"

type Prop = {
  style?: React.CSSProperties
  close: () => void
}

const navigationLinks = [
  { to: `/`, label: `Home` },
  { to: `/works`, label: `Works` },
  { to: `/posts`, label: `Posts` },
]

const SideBar: React.FCX<Prop> = ({ style, close }) => (
  <>
    <aside className={styles.side_bar} style={style}>
      <div className={styles.close}>
        <FontAwesomeIcon icon={faXmark} onClick={close} />
      </div>
      <ul className={styles.nav}>
        {navigationLinks.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} onClick={close}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.social}>
        {config.externalLinks.map(({ icon, url }) => (
          <li key={url}>
            <a href={url}>
              <FontAwesomeIcon icon={icon} />
            </a>
          </li>
        ))}
      </ul>
    </aside>
    <div className={styles.mask} style={style} onClick={close} />
  </>
)

export default SideBar
