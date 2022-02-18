import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHelmetSafety } from "@fortawesome/free-solid-svg-icons"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./posts.module.scss"

const PostsPage = () => (
  <Layout>
    <Seo title="Posts" />
    <h1 className={styles.title}>Posts</h1>
    <p>
      Under construction
      <FontAwesomeIcon icon={faHelmetSafety} />
    </p>
  </Layout>
)

export default PostsPage
