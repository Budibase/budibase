const path = require("path")

function sanitiseArgs(args) {
  let sanitised = []
  for (let arg of args) {
    sanitised.push(arg.replace(":", ""))
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
