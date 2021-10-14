const { atob } = require("../utilities")

// The method of executing JS scripts depends on the bundle being built.
// This setter is used in the entrypoint (either index.cjs or index.mjs).
let runJS
module.exports.setJSRunner = runner => (runJS = runner)

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
    if (data == null || typeof data !== "object") {
      return null
    }
    data = data[removeSquareBrackets(key)]
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
    return runJS(js, sandboxContext)
  } catch (error) {
    return "Error while executing JS"
  }
}
