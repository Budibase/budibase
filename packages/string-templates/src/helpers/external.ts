// @ts-ignore we don't have types for it
import helpers from "@budibase/handlebars-helpers"

import { date, duration } from "./date"
import {
  HelperFunctionBuiltin,
  EXTERNAL_FUNCTION_COLLECTIONS,
} from "./constants"
import Handlebars from "handlebars"

const ADDED_HELPERS = {
  date: date,
  duration: duration,
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
    let hbsHelperInfo = helpers[collection]()
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
    helpers[collection]({
      handlebars,
    })
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
