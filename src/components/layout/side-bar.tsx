import * as React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import * as styles from "./side-bar.module.scss"
import * as config from "./config"

type Prop = {
  showSideBar: boolean
  close: () => void
}

const navigationLinks = [
  { to: `/`, label: `Home` },
  { to: `/works`, label: `Works` },
  { to: `/posts`, label: `Posts` },
]

const SideBar: React.FCX<Prop> = ({ showSideBar, close }) => {
  const noSideBarClass = showSideBar ? `` : styles.no_side_bar
  return (
    <>
      <aside className={`${styles.side_bar} ${noSideBarClass}`}>
        <div className={styles.close}>
          <FontAwesomeIcon icon={faXmark} onClick={close} />
        </div>
        <ul className={styles.nav}>
          {navigationLinks.map(({ to, label }) => (
            <li key={to} className={styles.nav_item}>
              <Link to={to} onClick={close}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.spacer} />
        <ul className={styles.social}>
          {config.socialLinks.map(({ icon, url }) => (
            <li key={url} className={styles.social_item}>
              <a href={url}>
                <FontAwesomeIcon icon={icon} />
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Satoshi Takimoto.
        </p>
      </aside>
      <div className={`${styles.mask} ${noSideBarClass}`} onClick={close} />
    </>
  )
}

export default SideBar
