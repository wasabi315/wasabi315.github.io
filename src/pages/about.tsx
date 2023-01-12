import * as React from "react";
import { GatsbyImage, getImage, withArtDirection } from "gatsby-plugin-image";
import { graphql, PageProps } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithubAlt,
  faGitlab,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import Layout from "../components/layout";
import Seo from "../components/seo";
import * as style from "./about.module.scss";

const socialLinks = [
  { icon: faGithubAlt, url: `https://github.com/wasabi315`, name: `wasabi315` },
  { icon: faGitlab, url: `https://gitlab.com/wasabi315`, name: `wasabi315` },
  {
    icon: faTwitter,
    url: `https://twitter.com/wasabi__315`,
    name: `@wasabi__315`,
  },
] as const;

type Props = PageProps<Queries.AboutPageQueryQuery>;

const AboutPage = ({ data }: Props) => {
  const images = withArtDirection(getImage(data.portrait?.childImageSharp!)!, [
    {
      media: `(max-width: 768px)`,
      image: getImage(data.landscape?.childImageSharp!)!,
    },
  ]);

  return (
    <Layout>
      <section className={style.intro}>
        <figure>
          <GatsbyImage image={images} alt="" className={style.image} />
          <figcaption>Me feeding reindeers (Sweden, 2022)</figcaption>
        </figure>
        <div>
          <h1>Satoshi Takimoto</h1>
          <ul>
            {socialLinks.map(({ icon, url, name }) => (
              <li key={url}>
                <FontAwesomeIcon icon={icon} />
                <a href={url} rel="external noopener">
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <p>Hello! I'm a master's student at TokyoTech from Japan.</p>
          <p>
            I started learning programming circa 2017. I'm a member of the{" "}
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
        <h2>Skills</h2>
        <ul>
          <li>
            Build software language processors with Haskell, OCaml, Rust, etc.
          </li>
          <li>Basic proofs with Agda</li>
          <li>
            Frontend development using JavaScript, TypeScript, React, etc.
          </li>
          <li>Simple backend development using Go and Node.js</li>
        </ul>
      </section>
      <section className={style.certificates}>
        <h2>Certificates</h2>
        <ul>
          <li>応用情報技術者試験</li>
          <li>TOEIC® L&R Test: 855</li>
          <li>TOEFL® Test: 70</li>
        </ul>
      </section>
    </Layout>
  );
};

export default AboutPage;

export const Head = () => <Seo title="About" />;

export const query = graphql`
  query AboutPageQuery {
    portrait: file(name: { glob: "reindeers-portrait" }) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
    landscape: file(name: { glob: "reindeers-landscape" }) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
  }
`;
