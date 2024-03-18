import { date, duration } from "./date"

// https://github.com/evanw/esbuild/issues/56
const getExternalCollections = (): Record<string, () => any> => ({
  math: require("@budibase/handlebars-helpers/lib/math"),
  array: require("@budibase/handlebars-helpers/lib/array"),
  number: require("@budibase/handlebars-helpers/lib/number"),
  url: require("@budibase/handlebars-helpers/lib/url"),
  string: require("@budibase/handlebars-helpers/lib/string"),
  comparison: require("@budibase/handlebars-helpers/lib/comparison"),
  object: require("@budibase/handlebars-helpers/lib/object"),
  regex: require("@budibase/handlebars-helpers/lib/regex"),
  uuid: require("@budibase/handlebars-helpers/lib/uuid"),
})

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
  for (let collection of Object.values(getExternalCollections())) {
    for (let [key, func] of Object.entries(collection)) {
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
