const handlebars = require("handlebars")
const { registerAll } = require("./helpers/index")

const HBS_CLEANING_REGEX = /{{[^}}]*}}/g

/**
 * Templates are produced after an input string has been compiled, we store these templates in-case the same
 * string will be processed multiple times after the app has been loaded.
 * In the future storing these templates somewhere could save some processing time for large template runs.
 */
const COMPILED_TEMPLATES = {}

const hbsInstance = handlebars.create()
registerAll(hbsInstance)

function attemptToCorrectError(string) {
  return string
}

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
  let regex = new RegExp(HBS_CLEANING_REGEX)
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
 * @param {object|array} object The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @returns {object|array} The structure input, as fully updated as possible.
 */
module.exports.object = (object, context) => {
  // JSON stringify will fail if there are any cycles, stops infinite recursion
  try {
    JSON.stringify(object)
  } catch (err) {
    throw "Unable to process inputs to JSON, cannot recurse"
  }
  for (let key of Object.keys(object)) {
    let val = object[key]
    if (typeof val === "string") {
      module.exports.string(object[key], context)
    }
    // this covers objects and arrays
    else if (typeof val === "object") {
      object[key] = module.exports.object(object[key], context)
    }
  }
  return object
}

/**
 * This will process a single handlebars containing string. If the string passed in has no valid handlebars statements
 * then nothing will occur.
 * @param {string} string The template string which is the filled from the context object.
 * @param {object} context An object of information which will be used to enrich the string.
 * @returns {string} The enriched string, all templates should have been replaced if they can be.
 */
module.exports.string = (string, context) => {
  let template = COMPILED_TEMPLATES[string]
  if (template == null) {
    try {
      string = cleanHandlebars(string)
      template = hbsInstance.compile(string)
    } catch (err) {
      string = attemptToCorrectError(string)
      template = hbsInstance.compile(string)
    }
    // store the template for later, only after we know it worked
    COMPILED_TEMPLATES[string] = template
  }
  return template(context)
}

/**
 * Errors can occur if a user of this library attempts to use a helper that has not been added to the system, these errors
 * can be captured to alert the user of the mistake.
 * @param {function} handler a function which will be called every time an error occurs when processing a handlebars
 *         statement.
 */
module.exports.errorEvents = handler => {
  hbsInstance.registerHelper("helperMissing", handler)
}
