import path from "path"

// this simply runs all of our path join and resolve functions through
// a central location incase we need to add some protection to file paths

/**
 * Exactly the same as path.join
 * @param args Any number of string arguments to add to a path
 * @returns {string} The final path ready to use
 */
export function join(...args: string[]) {
  return path.join(...args)
}

/**
 * Exactly the same as path.resolve
 * @param args Any number of string arguments to add to a path
 * @returns {string} The final path ready to use
 */
export function resolve(...args: string[]) {
  return path.resolve(...args)
}
