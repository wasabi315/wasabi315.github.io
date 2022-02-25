import * as React from "react"
import Highlight, { defaultProps, Prism } from "prism-react-renderer"
import "../../styles/prism-wasabi.css"
;((typeof global !== "undefined" ? global : window) as any).Prism = Prism
require("prismjs/components/prism-haskell")
require("prismjs/components/prism-rust")
require("prismjs/components/prism-ocaml")
require("prismjs/components/prism-scheme")

// TODO: typings
const CodeBlock: React.FCX<any> = ({ children }) => {
  const className = children.props.className ?? ""
  const matches = className.match(/language-(?<lang>.*)/)
  const language = matches?.groups?.lang ?? ""
  const code = children.props.children.trim()

  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          <code className={className}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
