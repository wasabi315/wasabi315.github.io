import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as style from "./index.module.scss"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    <section className={style.hero}>
      <StaticImage src="../images/gatsby-icon.png" width={256} alt="wasabi" />
      <h1 className={style.hero_text}>I'm Satoshi Takimoto.</h1>
    </section>
    <section className={style.about}>
      <p>
        Hello! I'm an undergraduate student at Tokyo Tech,{" "}
        <a href="https://www.psg.c.titech.ac.jp/">Programming Systems Group</a>.
        My interest is in programming languages, especially functional
        programming languages.
      </p>
    </section>
    <section className={style.detail}>
      <h2>Research Area</h2>
      <ul>
        <li>Programming language theory</li>
        <li>Functional reactive programming and embedded systems</li>
      </ul>
    </section>
    <section className={style.detail}>
      <h2>Programming Language Skills</h2>
      <ul>
        <li>Haskell: Intermediate</li>
        <li>Typescript, Javascript: Intermediate</li>
        <li>React, Vue: Intermediate</li>
        <li>Rust: Beginner</li>
        <li>OCaml: Beginner</li>
      </ul>
    </section>
    <section className={style.detail}>
      <h2>Certificates</h2>
      <ul>
        <li>Applied Information Technology Enginner</li>
        <li>TOEIC® L&R Test: 855</li>
        <li>TOEFL® Test: 70</li>
      </ul>
    </section>
  </Layout>
)

export default IndexPage
