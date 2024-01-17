// import { addedHelpers } from "./helpers/external"

// https://github.com/evanw/esbuild/issues/56
const externalCollections = {
  math: require("@budibase/handlebars-helpers/lib/math"),
  array: require("@budibase/handlebars-helpers/lib/array"),
  number: require("@budibase/handlebars-helpers/lib/number"),
  // url: require("@budibase/handlebars-helpers/lib/url"),
  string: require("@budibase/handlebars-helpers/lib/string"),
  // comparison: require("@budibase/handlebars-helpers/lib/comparison"),
  object: require("@budibase/handlebars-helpers/lib/object"),
  // regex: require("@budibase/handlebars-helpers/lib/regex"),
  // uuid: require("@budibase/handlebars-helpers/lib/uuid"),
}

let helpers = undefined

const getHelperList = () => {
  if (helpers) {
    return helpers
  }

  helpers = {}
  for (let collection of Object.values(externalCollections)) {
    for (let [key, func] of Object.entries(collection)) {
      helpers[key] = func
    }
  }
  // for (let key of Object.keys(addedHelpers)) {
  //   helpers[key] = addedHelpers[key]
  // }
  return helpers
}

export default getHelperList()
