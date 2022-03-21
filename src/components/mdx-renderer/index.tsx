import * as React from "react"
import { MDXProvider, MDXProviderComponentsProp } from "@mdx-js/react"
import { MDXRenderer as _MDXRenderer } from "gatsby-plugin-mdx"
import CodeBlock from "./code-block"
import * as styles from "./index.module.scss"
import withAnchorLink from "./with-anchor-link"

const components: MDXProviderComponentsProp = {
  pre: CodeBlock,
  // h1: withAnchorLink(`h1`),
  // h2: withAnchorLink(`h2`),
  // h3: withAnchorLink(`h3`),
  // h4: withAnchorLink(`h4`),
}

type Props = React.ComponentProps<typeof _MDXRenderer>

const MDXRenderer: React.FCX<Props> = props => (
  <MDXProvider components={components}>
    <section className={styles.markdown}>
      <_MDXRenderer {...props} />
    </section>
  </MDXProvider>
)

export default MDXRenderer
