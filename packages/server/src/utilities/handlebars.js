const handlebars = require("handlebars")

handlebars.registerHelper("object", value => {
  return new handlebars.SafeString(JSON.stringify(value))
})

/**
 * When running handlebars statements to execute on the context of the automation it possible user's may input handlebars
 * in a few different forms, some of which are invalid but are logically valid. An example of this would be the handlebars
 * statement "{{steps[0].revision}}" here it is obvious the user is attempting to access an array or object using array
 * like operators. These are not supported by handlebars and therefore the statement will fail. This function will clean up
 * the handlebars statement so it instead reads as "{{steps.0.revision}}" which is valid and will work. It may also be expanded
 * to include any other handlebars statement cleanup that has been deemed necessary for the system.
 *
 * @param {string} string The string which *may* contain handlebars statements, it is OK if it does not contain any.
 * @returns {string} The string that was input with cleaned up handlebars statements as required.
 */
function cleanHandlebars(string) {
  let charToReplace = {
    "[": ".",
    "]": "",
  }
  let regex = new RegExp(/{{[^}}]*}}/g)
  let matches = string.match(regex)
  if (matches == null) {
    return string
  }
  for (let match of matches) {
    let baseIdx = string.indexOf(match)
    for (let key of Object.keys(charToReplace)) {
      let idxChar = match.indexOf(key)
      if (idxChar !== -1) {
        string =
          string.slice(baseIdx, baseIdx + idxChar) +
          charToReplace[key] +
          string.slice(baseIdx + idxChar + 1)
      }
    }
  }
  return string
}

/**
 * Given an input object this will recurse through all props to try and update
 * any handlebars statements within.
 * @param {object|array} inputs The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @returns {object|array} The structure input, as fully updated as possible.
 */
function recurseHandlebars(inputs, context) {
  // JSON stringify will fail if there are any cycles, stops infinite recursion
  try {
    JSON.stringify(inputs)
  } catch (err) {
    throw "Unable to process inputs to JSON, cannot recurse"
  }
  for (let key of Object.keys(inputs)) {
    let val = inputs[key]
    if (typeof val === "string") {
      val = cleanHandlebars(inputs[key])
      const template = handlebars.compile(val)
      inputs[key] = template(context)
    }
    // this covers objects and arrays
    else if (typeof val === "object") {
      inputs[key] = recurseHandlebars(inputs[key], context)
    }
  }
  return inputs
}

exports.recurseHandlebars = recurseHandlebars
