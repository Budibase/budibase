const handlebars = require("handlebars")
const { registerAll } = require("./helpers/index")
const { preprocess } = require("./custom/preprocessor")

const hbsInstance = handlebars.create()
registerAll(hbsInstance)

/**
 * utility function to check if the object is valid
 */
function testObject(object) {
  // JSON stringify will fail if there are any cycles, stops infinite recursion
  try {
    JSON.stringify(object)
  } catch (err) {
    throw "Unable to process inputs to JSON, cannot recurse"
  }
}

/**
 * Given an input object this will recurse through all props to try and update any handlebars statements within.
 * @param {object|array} object The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @returns {Promise<object|array>} The structure input, as fully updated as possible.
 */
module.exports.processObject = async (object, context) => {
  testObject(object)
  for (let key of Object.keys(object)) {
    let val = object[key]
    if (typeof val === "string") {
      object[key] = await module.exports.processString(object[key], context)
    } else if (typeof val === "object") {
      object[key] = await module.exports.processObject(object[key], context)
    }
  }
  return object
}

/**
 * This will process a single handlebars containing string. If the string passed in has no valid handlebars statements
 * then nothing will occur.
 * @param {string} string The template string which is the filled from the context object.
 * @param {object} context An object of information which will be used to enrich the string.
 * @returns {Promise<string>} The enriched string, all templates should have been replaced if they can be.
 */
module.exports.processString = async (string, context) => {
  // TODO: carry out any async calls before carrying out async call
  return module.exports.processStringSync(string, context)
}

/**
 * Given an input object this will recurse through all props to try and update any handlebars statements within. This is
 * a pure sync call and therefore does not have the full functionality of the async call.
 * @param {object|array} object The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @returns {object|array} The structure input, as fully updated as possible.
 */
module.exports.processObjectSync = (object, context) => {
  testObject(object)
  for (let key of Object.keys(object)) {
    let val = object[key]
    if (typeof val === "string") {
      object[key] = module.exports.processStringSync(object[key], context)
    } else if (typeof val === "object") {
      object[key] = module.exports.processObjectSync(object[key], context)
    }
  }
  return object
}

/**
 * This will process a single handlebars containing string. If the string passed in has no valid handlebars statements
 * then nothing will occur. This is a pure sync call and therefore does not have the full functionality of the async call.
 * @param {string} string The template string which is the filled from the context object.
 * @param {object} context An object of information which will be used to enrich the string.
 * @returns {string} The enriched string, all templates should have been replaced if they can be.
 */
module.exports.processStringSync = (string, context) => {
  if (typeof string !== "string") {
    throw "Cannot process non-string types."
  }
  let template
  string = preprocess(string)
  // this does not throw an error when template can't be fulfilled, have to try correct beforehand
  template = hbsInstance.compile(string)
  return template(context)
}

/**
 * Errors can occur if a user of this library attempts to use a helper that has not been added to the system, these errors
 * can be captured to alert the user of the mistake.
 * @param {function} handler a function which will be called every time an error occurs when processing a handlebars
 * statement.
 */
module.exports.errorEvents = handler => {
  hbsInstance.registerHelper("helperMissing", handler)
}
