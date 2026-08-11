import { date, difference, duration, durationFromNow } from "./date"
import { externalHelperCollections } from "./list"
import {
  HelperFunctionBuiltin,
  EXTERNAL_FUNCTION_COLLECTIONS,
} from "./constants"
import Handlebars from "handlebars"

const ADDED_HELPERS = {
  date,
  duration,
  difference,
  durationFromNow,
}

export const externalCollections = EXTERNAL_FUNCTION_COLLECTIONS
export const addedHelpers = ADDED_HELPERS

export function registerAll(handlebars: typeof Handlebars) {
  for (let [name, helper] of Object.entries(ADDED_HELPERS)) {
    handlebars.registerHelper(name, helper)
  }
  let externalNames = []
  for (let collection of EXTERNAL_FUNCTION_COLLECTIONS) {
    // collect information about helper
    const hbsHelperInfo =
      externalHelperCollections[
        collection as keyof typeof externalHelperCollections
      ]
    for (const [name, helper] of Object.entries(hbsHelperInfo)) {
      handlebars.registerHelper(name, helper)
    }
    for (let entry of Object.entries(hbsHelperInfo)) {
      const name = entry[0]
      // skip built-in functions and ones seen already
      if (
        HelperFunctionBuiltin.indexOf(name) !== -1 ||
        externalNames.indexOf(name) !== -1
      ) {
        continue
      }
      externalNames.push(name)
    }
    // attach it to our handlebars instance
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
