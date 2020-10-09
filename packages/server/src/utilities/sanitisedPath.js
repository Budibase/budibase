const path = require("path")

const regex = new RegExp(/:(?![\\/])/g)
// set a limit on path depth, just incase recursion is occurring
const MAX_ARGS = 50

function sanitiseArgs(args) {
  let sanitised = []
  let count = 0
  for (let arg of args) {
    // if a known string is found don't continue, can't operate on it
    if (typeof arg !== "string") {
      throw "Sanitisation of paths can only occur on strings"
    }
    // maximum number of path args have been iterated on
    if (count > MAX_ARGS) {
      break
    }
    sanitised.push(arg.replace(regex, ""))
    count++
  }
  return sanitised
}

/**
 * Exactly the same as path.join but creates a sanitised path.
 * @param args Any number of string arguments to add to a path
 * @returns {string} The final path ready to use
 */
exports.join = function(...args) {
  return path.join(...sanitiseArgs(args))
}

/**
 * Exactly the same as path.resolve but creates a sanitised path.
 * @param args Any number of string arguments to add to a path
 * @returns {string} The final path ready to use
 */
exports.resolve = function(...args) {
  return path.resolve(...sanitiseArgs(args))
}

/**
 * Sanitise a single string
 * @param string input string to sanitise
 * @returns {string} the final sanitised string
 */
exports.sanitise = function(string) {
  return sanitiseArgs([string])[0]
}
