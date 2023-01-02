import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faGitlab,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import Layout from "../components/layout";
import Seo from "../components/seo";
import * as style from "./about.module.scss";
import me from "../images/me.webp";
import haskellLogo from "../images/haskell.svg";
import ocamlLogo from "../images/ocaml.svg";
import rustLogo from "../images/rust.svg";
import jsLogo from "../images/javascript.svg";
import tsLogo from "../images/typescript.svg";
import agdaLogo from "../images/agda.svg";

const socialLinks = [
  { icon: faGithubAlt, url: `https://github.com/wasabi315`, name: `wasabi315` },
  { icon: faGitlab, url: `https://gitlab.com/wasabi315`, name: `wasabi315` },
  {
    icon: faTwitter,
    url: `https://twitter.com/wasabi65255737`,
    name: `@wasabi65255737`,
  },
] as const;

const devLogos: Record<string, string> = {
  haskell: haskellLogo,
  ocaml: ocamlLogo,
  javascript: jsLogo,
  typescript: tsLogo,
  rust: rustLogo,
  agda: agdaLogo,
};

const AboutPage = () => (
  <Layout>
    <section className={style.intro}>
      <figure>
        <img src={me} alt="" />
        <figcaption>Me feeding reindeers, Kiruna, Sweden</figcaption>
      </figure>
      <div>
        <h1>Satoshi Takimoto</h1>
        <ul>
          {socialLinks.map(({ icon, url, name }) => (
            <li key={url}>
              <FontAwesomeIcon icon={icon} size="lg" />
              <a href={url} rel="external noopener">
                {name}
              </a>
            </li>
          ))}
        </ul>
        <p>Hello! I am a master's student at TokyoTech from Japan.</p>
        <p>
          I started learning programming circa 2017. I am a member of the{" "}
          <a href="https://www.psg.c.titech.ac.jp/">
            Programming Systems Group
          </a>{" "}
          and researching programming languages.
        </p>
        <p>
          My hobbies include traveling, visiting museums, and collecting
          postcards.
        </p>
      </div>
    </section>
    <section className={style.skills}>
      <h2 className={style.section_title}>Skills</h2>
      <ul>
        <li>
          Build software language processors with Haskell, OCaml, Rust, etc.
        </li>
        <li>Frontend development using JavaScript, TypeScript, React, etc.</li>
        <li>Simple backend development using Go and Node.js</li>
      </ul>
    </section>
    <section className={style.certificates}>
      <h2 className={style.section_title}>Certificates</h2>
      <ul>
        <li>応用情報技術者試験</li>
        <li>TOEIC® L&R Test: 855</li>
        <li>TOEFL® Test: 70</li>
      </ul>
    </section>
  </Layout>
);

export default AboutPage;

export const Head = () => <Seo title="About" />;
