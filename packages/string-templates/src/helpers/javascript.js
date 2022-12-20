const { atob } = require("../utilities")
const { cloneDeep } = require("lodash/fp")
const { LITERAL_MARKER } = require("../helpers/constants")
const { getHelperList } = require("./list")

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
  if (process && process.env.NO_JS) {
    throw new Error("JS disabled in environment.")
  }
  try {
    // Wrap JS in a function and immediately invoke it.
    // This is required to allow the final `return` statement to be valid.
    const js = `function run(){${atob(handlebars)}};run();`

    // Our $ context function gets a value from context.
    // We clone the context to avoid mutation in the binding affecting real
    // app context.
    const sandboxContext = {
      $: path => getContextValue(path, cloneDeep(context)),
      helpers: getHelperList(),
    }

    // Create a sandbox with our context and run the JS
    const res = { data: runJS(js, sandboxContext) }
    return `{{${LITERAL_MARKER} js_result-${JSON.stringify(res)}}}`
  } catch (error) {
    return "Error while executing JS"
  }
}
