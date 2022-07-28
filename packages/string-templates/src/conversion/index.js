const { getHelperList } = require("../helpers")

function getLayers(fullBlock) {
  let layers = []
  while (fullBlock.length) {
    const start = fullBlock.lastIndexOf("("),
      end = fullBlock.indexOf(")")
    let layer
    if (start === -1 || end === -1) {
      layer = fullBlock.trim()
      fullBlock = ""
    } else {
      const untrimmed = fullBlock.substring(start, end + 1)
      layer = untrimmed.substring(1, untrimmed.length - 1).trim()
      fullBlock =
        fullBlock.slice(0, start) +
        fullBlock.slice(start + untrimmed.length + 1, fullBlock.length)
    }
    layers.push(layer)
  }
  return layers
}

function getVariable(variableName) {
  return isNaN(parseFloat(variableName)) ? `$("${variableName}")` : variableName
}

function buildList(parts, value) {
  function build() {
    return parts
      .map(part => (part.startsWith("helper") ? part : getVariable(part)))
      .join(", ")
  }
  if (!value) {
    return parts.length > 1 ? `...[${build()}]` : build()
  } else {
    return parts.length === 0 ? value : `...[${value}, ${build()}]`
  }
}

function splitBySpace(layer) {
  const parts = []
  let started = null,
    last = 0
  for (let index = 0; index < layer.length; index++) {
    const char = layer[index]
    if (char === "[" && started == null) {
      started = index
    } else if (char === "]" && started != null && layer[index + 1] !== ".") {
      parts.push(layer.substring(started, index + 1).trim())
      started = null
      last = index
    } else if (started == null && char === " ") {
      parts.push(layer.substring(last, index).trim())
      last = index
    }
  }
  if (!layer.startsWith("[")) {
    parts.push(layer.substring(last, layer.length).trim())
  }
  return parts
}

module.exports.convertHBSBlock = (block, blockNumber) => {
  const braceLength = block[2] === "{" ? 3 : 2
  block = block.substring(braceLength, block.length - braceLength).trim()
  const layers = getLayers(block)

  let value = null
  const list = getHelperList()
  for (let layer of layers) {
    const parts = splitBySpace(layer)
    if (value || parts.length > 1) {
      // first of layer should always be the helper
      const helper = parts.splice(0, 1)
      if (list[helper]) {
        value = `helpers.${helper}(${buildList(parts, value)})`
      }
    }
    // no helpers
    else {
      value = getVariable(parts[0])
    }
  }
  // split by space will remove square brackets
  return { variable: `var${blockNumber}`, value }
}
