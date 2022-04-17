const visit = require(`unist-util-visit`);

module.exports = function sourceLine() {
  return transformer;

  function transformer(tree) {
    visit(tree, isElementWithPosition, (node) => {
      const { start, end } = node.position;
      setSourceLineProps(node, {
        start: start.line,
        end: end.line,
      });
    });
  }

  function isElementWithPosition(node) {
    return node.type === `element` && node.position;
  }

  function setSourceLineProps(node, { start, end }) {
    node.properties = {
      ...node.properties,
      [`data-source-line-start`]: start,
      [`data-source-line-end`]: end,
    };
  }
};
