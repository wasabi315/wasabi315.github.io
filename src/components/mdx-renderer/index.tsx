import * as React from "react"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer as _MDXRenderer } from "gatsby-plugin-mdx"
import CodeBlock from "./code-block"
import * as styles from "./index.module.scss"

const components = {
  pre: CodeBlock,
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
