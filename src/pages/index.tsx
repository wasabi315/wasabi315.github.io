import * as React from "react";

import Layout from "../components/layout";
import Seo from "../components/seo";
import * as style from "./index.module.scss";
import logo from "../images/wasabi-icon.svg";
import haskellLogo from "../images/haskell.svg";
import ocamlLogo from "../images/ocaml.svg";
import rustLogo from "../images/rust.svg";
import jsLogo from "../images/javascript.svg";
import tsLogo from "../images/typescript.svg";
import agdaLogo from "../images/agda.svg";

const devLogos: Record<string, string> = {
  haskell: haskellLogo,
  ocaml: ocamlLogo,
  javascript: jsLogo,
  typescript: tsLogo,
  rust: rustLogo,
  agda: agdaLogo,
};

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
    <section className={style.skills}>
      <h2 className={style.section_title}>Programming Language Skills</h2>
      <ul>
        {Object.entries(devLogos).map(([lang, logo]) => (
          <li key={lang} title={lang}>
            <img src={logo} alt={lang} />
          </li>
        ))}
      </ul>
    </section>
    <section className={style.certificates}>
      <h2 className={style.section_title}>Certificates</h2>
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
