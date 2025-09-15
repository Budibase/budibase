import { date, duration } from "./date"

/* 
@budibase/handlebars-helpers is not treeshakeable, so we can't use the barrel files. 
Otherwise, we have issues when generating the isolated-vm bundle because of the treeshaking
*/
/* eslint-disable local-rules/no-budibase-imports */
// @ts-expect-error
import * as math from "@budibase/handlebars-helpers/lib/math"
// @ts-expect-error
import * as array from "@budibase/handlebars-helpers/lib/array"
// @ts-expect-error
import * as number from "@budibase/handlebars-helpers/lib/number"
// @ts-expect-error
import * as url from "@budibase/handlebars-helpers/lib/url"
// @ts-expect-error
import * as string from "@budibase/handlebars-helpers/lib/string"
// @ts-expect-error
import * as comparison from "@budibase/handlebars-helpers/lib/comparison"
// @ts-expect-error
import * as object from "@budibase/handlebars-helpers/lib/object"
// @ts-expect-error
import * as regex from "@budibase/handlebars-helpers/lib/regex"
// @ts-expect-error
import * as uuid from "@budibase/handlebars-helpers/lib/uuid"
/* eslint-enable local-rules/no-budibase-imports */

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
    for (let [key, func] of Object.entries<any>(collection)) {
      // Handlebars injects the hbs options to the helpers by default. We are adding an empty {} as a last parameter to simulate it
      helpers[key] = (...props: any) => func(...props, {})
    }
  }
  helpers = {
    ...helpers,
    ...addedHelpers,
  }

  for (const toRemove of helpersToRemoveForJs) {
    delete helpers[toRemove]
  }
  Object.freeze(helpers)
  return helpers
}
