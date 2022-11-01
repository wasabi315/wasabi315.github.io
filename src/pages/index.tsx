import * as React from "react";

import Layout from "../components/layout";
import Seo from "../components/seo";
import * as style from "./index.module.scss";
import logo from "../images/wasabi-icon.svg";

const IndexPage = () => (
  <Layout>
    <section className={style.hero}>
      <div>
        <h2>こんにちは世界, I'm</h2>
        <h1>Satoshi.</h1>
        <p>
          A master's student at Tokyo Tech. Interested in (functional)
          programming languages.
        </p>
      </div>
      <img src={logo} alt="wasabi" />
    </section>
    <section className={style.detail}>
      <h2>Programming Language Proficiency</h2>
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
);

export default IndexPage;

export const Head = () => <Seo title="Home" />;
