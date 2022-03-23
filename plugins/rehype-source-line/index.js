const fs = require(`fs/promises`)

module.exports = function rehypeSourceLine() {
  async function transformer(tree, file) {
    const { visit } = await import(`unist-util-visit`)

    const lineCount = await readFrontmatterLineCounts(file)
    transformElementWithPosition(visit, tree, lineCount)
    transformParagraph(visit, tree)
    transformCodeBlock(visit, tree)
  }

  return transformer
}

/* FIXME: Hacky */
async function readFrontmatterLineCounts(file) {
  const originalContent = await fs.readFile(file.path, `utf8`)
  const frontmatter = originalContent.split(/---\n/)[1]
  return frontmatter.split(`\n`).length + 1 // +1 for the end delimiter ---
}

function transformElementWithPosition(visit, tree, frontmatterLineCounts) {
  function isElementWithPosition(node) {
    return node.type === `element` && node.position
  }

  visit(tree, isElementWithPosition, node => {
    const { start, end } = node.position
    setSourceLineProps(node, {
      start: start.line + frontmatterLineCounts,
      end: end.line + frontmatterLineCounts,
    })
  })
}

function transformParagraph(visit, tree) {
  function isParagraph(node) {
    return node.type === `element` && node.tagName === `p`
  }

  visit(tree, isParagraph, node => {
    // 1. split text into lines
    node.children = node.children.flatMap(child => {
      if (child.type !== `text`) {
        return [child]
      }

      const lines = child.value.split(`\n`)
      return lines.flatMap((line, index) => {
        const newline = index === 0 ? [] : [{ type: `text`, value: `\n` }]
        const text = { type: `text`, value: line }
        const span = { type: `element`, tagName: `span`, children: [text] }
        const elem = line === `` ? [] : line === ` ` ? [text] : [span]
        return [...newline, ...elem]
      })
    })

    // 2. add source line props
    const sourceLineProps = getSourceLineProps(node)
    transformLines(node.children, sourceLineProps.start)
  })
}

function transformCodeBlock(visit, tree) {
  function isCodeBlockWrapper(node) {
    return node.properties?.className?.includes(`gatsby-highlight`)
  }

  visit(tree, isCodeBlockWrapper, node => {
    const tokens = node.children[0].children[0].children
    const sourceLineProps = getSourceLineProps(node)
    transformLines(tokens, sourceLineProps.start + 1) // +1 for the start delimiter ```
  })
}

function transformLines(nodes, startLine) {
  function isNewlineText(node) {
    return node.type === `text` && node.value === `\n`
  }

  let line = startLine
  nodes.forEach(node => {
    if (isNewlineText(node)) {
      line++
    }
    if (node.type === `element`) {
      setSourceLineProps(node, { start: line, end: line })
    }
  })
}

function getSourceLineProps(node) {
  return {
    start: node.properties[`data-source-line-start`],
    end: node.properties[`data-source-line-end`],
  }
}

function setSourceLineProps(node, { start, end }) {
  node.properties = {
    ...node.properties,
    [`data-source-line-start`]: start,
    [`data-source-line-end`]: end,
  }
}
