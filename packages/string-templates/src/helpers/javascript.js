const CAPTURE_JS = new RegExp(/{{ js "(.*)" }}/)
const vm = require("vm")

// Helper utility to strip square brackets from a value
const removeSquareBrackets = value => {
  if (!value || typeof value !== "string") {
    return value
  }
  const regex = /\[+(.+)]+/
  const matches = value.match(regex)
  if (matches && matches[1]) {
    return matches[1]
  }
  return value
}

// Our context getter function provided to JS code as $.
// Extracts a value from context.
const getContextValue = (path, context) => {
  let data = context
  path.split(".").forEach(key => {
    data = data[removeSquareBrackets(key)] || {}
  })
  return data
}

// Evaluates JS code against a certain context
module.exports.processJS = (handlebars, context) => {
  try {
    // Wrap JS in a function and immediately invoke it.
    // This is required to allow the final `return` statement to be valid.
    const js = `function run(){${atob(handlebars)}};run();`

    // Our $ context function gets a value from context
    const sandboxContext = { $: path => getContextValue(path, context) }

    // Create a sandbox with out context and run the JS
    vm.createContext(sandboxContext)
    return vm.runInNewContext(js, sandboxContext)
  } catch (error) {
    return "Error while executing JS"
  }
}

// Checks if a HBS expression is a valid JS HBS expression
module.exports.isJSBinding = handlebars => {
  return module.exports.decodeJSBinding(handlebars) != null
}

// Encodes a raw JS string as a JS HBS expression
module.exports.encodeJSBinding = javascript => {
  return `{{ js "${btoa(javascript)}" }}`
}

// Decodes a JS HBS expression to the raw JS string
module.exports.decodeJSBinding = handlebars => {
  if (!handlebars || typeof handlebars !== "string") {
    return null
  }

  // JS is only valid if it is the only HBS expression
  if (!handlebars.trim().startsWith("{{ js ")) {
    return null
  }

  const match = handlebars.match(CAPTURE_JS)
  if (!match || match.length < 2) {
    return null
  }
  return atob(match[1])
}
