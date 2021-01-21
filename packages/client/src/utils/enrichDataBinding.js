import { cloneDeep } from "lodash/fp"
import mustache from "mustache"

// this is a much more liberal version of mustache's escape function
// ...just ignoring < and > to prevent tags from user input
// original version here https://github.com/janl/mustache.js/blob/4b7908f5c9fec469a11cfaed2f2bed23c84e1c5c/mustache.js#L78
const entityMap = {
  "<": "&lt;",
  ">": "&gt;",
}
mustache.escape = text => {
  if (text == null || typeof text !== "string") {
    return text
  }
  return text.replace(/[<>]/g, function fromEntityMap(s) {
    return entityMap[s] || s
  })
}

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
  return mustache.render(input, context)
}

/**
 * Recursively enriches all props in a props object and returns the new props.
 * Props are deeply cloned so that no mutation is done to the source object.
 */
export const enrichDataBindings = (props, context) => {
  let clonedProps = cloneDeep(props)
  recursiveEnrich(clonedProps, context)
  return clonedProps
}

/**
 * Recurses through an object and enriches all string props found.
 */
const recursiveEnrich = (props, context) => {
  if (typeof props !== "object") {
    return
  }
  let keys = []
  if (Array.isArray(props)) {
    keys = Array.from(props.keys())
  } else if (typeof props === "object") {
    keys = Object.keys(props || {})
  }
  keys.forEach(key => {
    if (typeof props[key] === "string") {
      props[key] = enrichDataBinding(props[key], context)
    } else {
      recursiveEnrich(props[key], context)
    }
  })
}
