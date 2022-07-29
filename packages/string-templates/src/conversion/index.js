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
  if (!variableName || typeof variableName !== "string") {
    return variableName
  }
  // it is an array
  const arrayOrObject = [",", "{", ":"]
  let contains = false
  arrayOrObject.forEach(char => {
    if (variableName.includes(char)) {
      contains = true
    }
  })
  if (variableName.startsWith("[") && contains) {
    return variableName
  }
  // it is just a number
  if (!isNaN(parseFloat(variableName))) {
    return variableName
  }
  if (variableName.startsWith("'") || variableName.startsWith('"')) {
    return variableName
  }
  // extract variable
  return `$("${variableName}")`
}

function buildList(parts, value) {
  function build() {
    return parts
      .map(part => (part.startsWith("helper") ? part : getVariable(part)))
      .join(", ")
  }
  if (!value) {
    return parts.length > 1 ? `${build()}` : build()
  } else {
    return parts.length === 0 ? value : `${value}, ${build()}`
  }
}

function splitBySpace(layer) {
  const parts = []
  let started = null,
    endChar = null,
    last = 0
  function add(str) {
    const startsWith = ["]"]
    while (startsWith.indexOf(str.substring(0, 1)) !== -1) {
      str = str.substring(1, str.length)
    }
    if (str.length > 0) {
      parts.push(str.trim())
    }
  }
  const continuationChars = ["[", "'", '"']
  for (let index = 0; index < layer.length; index++) {
    const char = layer[index]
    if (continuationChars.indexOf(char) !== -1 && started == null) {
      started = index
      endChar = char === "[" ? "]" : char
    } else if (
      char === endChar &&
      started != null &&
      layer[index + 1] !== "."
    ) {
      add(layer.substring(started, index + 1))
      started = null
      endChar = null
      last = index + 1
    } else if (started == null && char === " ") {
      add(layer.substring(last, index))
      last = index
    }
  }
  if (
    (!layer.startsWith("[") || parts.length === 0) &&
    last !== layer.length - 1
  ) {
    add(layer.substring(last, layer.length))
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
