import handlebars from "handlebars"

// Regex to test inputs with to see if they are likely candidates for mustache
const looksLikeMustache = /{{.*}}/

/**
 * Enriches a given input with a row from the database.
 */
export const enrichDataBinding = (input, context) => {
  // Only accept string inputs
  if (!input || typeof input !== "string") {
    return input
  }
  // Do a fast regex check if this looks like a mustache string
  if (!looksLikeMustache.test(input)) {
    return input
  }
  return handlebars.render(input, context)
}

/**
 * Enriches each prop in a props object
 */
export const enrichDataBindings = (props, context) => {
  let enrichedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    enrichedProps[key] = enrichDataBinding(value, context)
  })
  return enrichedProps
}
