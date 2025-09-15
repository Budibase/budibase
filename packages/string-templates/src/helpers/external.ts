import Handlebars from "handlebars"
import { HelperFunctionBuiltin } from "./constants"
import { date, difference, duration, durationFromNow } from "./date"

// Import individual helper collections for better tree-shaking using require
// to avoid ESLint issues with @budibase imports
const HELPER_COLLECTIONS = {
  math: require("@budibase/handlebars-helpers/lib/math"),
  array: require("@budibase/handlebars-helpers/lib/array"),
  number: require("@budibase/handlebars-helpers/lib/number"),
  url: require("@budibase/handlebars-helpers/lib/url"),
  string: require("@budibase/handlebars-helpers/lib/string"),
  comparison: require("@budibase/handlebars-helpers/lib/comparison"),
  object: require("@budibase/handlebars-helpers/lib/object"),
  regex: require("@budibase/handlebars-helpers/lib/regex"),
  uuid: require("@budibase/handlebars-helpers/lib/uuid"),
}

/**
 * full list of supported helpers can be found here:
 * https://github.com/Budibase/handlebars-helpers
 */
export const EXTERNAL_FUNCTION_COLLECTIONS = Object.keys(HELPER_COLLECTIONS)

const ADDED_HELPERS = {
  date,
  duration,
  difference,
  durationFromNow,
}

export function registerAll(handlebars: typeof Handlebars) {
  for (let [name, helper] of Object.entries(ADDED_HELPERS)) {
    handlebars.registerHelper(name, helper)
  }
  let externalNames = []

  for (let [_collectionName, helpers] of Object.entries(HELPER_COLLECTIONS)) {
    // collect information about helper
    for (let entry of Object.entries(helpers)) {
      const name = entry[0]
      // skip built-in functions and ones seen already
      if (
        HelperFunctionBuiltin.indexOf(name) !== -1 ||
        externalNames.indexOf(name) !== -1
      ) {
        continue
      }
      const helper = entry[1] as any
      handlebars.registerHelper(name, helper)
      externalNames.push(name)
    }
  }
  // add date external functionality
  externalHelperNames = externalNames.concat(Object.keys(ADDED_HELPERS))
}

export function unregisterAll(handlebars: typeof Handlebars) {
  for (let name of Object.keys(ADDED_HELPERS)) {
    handlebars.unregisterHelper(name)
  }
  for (let name of externalHelperNames) {
    handlebars.unregisterHelper(name)
  }
  externalHelperNames = []
}

export let externalHelperNames: any[] = []