import { processString } from "@budibase/string-templates"

// Regex to test inputs with to see if they are likely candidates for template strings
const looksLikeTemplate = /{{.*}}/

/**
 * Enriches a given input with a row from the database.
 */
export const enrichDataBinding = async (input, context) => {
  // Only accept string inputs
  if (!input || typeof input !== "string") {
    return input
  }
  // Do a fast regex check if this looks like a template string
  if (!looksLikeTemplate.test(input)) {
    return input
  }
  return processString(input, context)
}

/**
 * Enriches each prop in a props object
 */
export const enrichDataBindings = async (props, context) => {
  let enrichedProps = {}
  for (let [key, value] of Object.entries(props)) {
    enrichedProps[key] = await enrichDataBinding(value, context)
  }
  return enrichedProps
}
