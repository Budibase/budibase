import { date, duration } from "./date"

import {
  math,
  array,
  number,
  url,
  string,
  comparison,
  object,
  regex,
  uuid,
  // @ts-expect-error
} from "@budibase/handlebars-helpers"

// https://github.com/evanw/esbuild/issues/56
const externalCollections = {
  math,
  array,
  number,
  url,
  string,
  comparison,
  object,
  regex,
  uuid,
}

export const helpersToRemoveForJs = ["sortBy"]

const addedHelpers = {
  date: date,
  duration: duration,
}

let helpers: Record<string, any>

export function getJsHelperList() {
  if (helpers) {
    return helpers
  }

  helpers = {}
  for (let collection of Object.values(externalCollections)) {
    for (let [key, func] of Object.entries<any>(collection())) {
      // Handlebars injects the hbs options to the helpers by default. We are adding an empty {} as a last parameter to simulate it
      helpers[key] = (...props: any) => func(...props, {})
    }
  }
  helpers = {
    ...helpers,
    addedHelpers,
  }

  for (const toRemove of helpersToRemoveForJs) {
    delete helpers[toRemove]
  }
  Object.freeze(helpers)
  return helpers
}
