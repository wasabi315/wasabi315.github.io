import * as React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"

// TODO: typings
const CodeBlock: React.FC<any> = ({ children }) => {
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
