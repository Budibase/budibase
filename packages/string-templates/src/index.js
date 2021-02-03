const handlebars = require("handlebars")
const { registerAll } = require("./helpers/index")
const processors = require("./processors")
const { cloneDeep } = require("lodash/fp")
const { removeNull, addConstants } = require("./utilities")
const manifest = require("../manifest.json")

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
    if (object[key] != null) {
      let val = object[key]
      if (typeof val === "string") {
        object[key] = await module.exports.processString(object[key], context)
      } else if (typeof val === "object") {
        object[key] = await module.exports.processObject(object[key], context)
      }
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
  const input = cloneDeep(string)
  let clonedContext = removeNull(cloneDeep(context))
  clonedContext = addConstants(clonedContext)
  // remove any null/undefined properties
  if (typeof string !== "string") {
    throw "Cannot process non-string types."
  }
  try {
    string = processors.preprocess(string)
    // this does not throw an error when template can't be fulfilled, have to try correct beforehand
    const template = hbsInstance.compile(string, {
      strict: false,
    })
    return processors.postprocess(template(clonedContext))
  } catch (err) {
    // suggested that we should always return input if an error occurs, incase string wasn't supposed to
    // contain any handlebars statements
    return input
  }
}

/**
 * Simple utility function which makes sure that a templating property has been wrapped in literal specifiers correctly.
 * @param {string} property The property which is to be wrapped.
 * @returns {string} The wrapped property ready to be added to a templating string.
 */
module.exports.makePropSafe = property => {
  return `[${property}]`.replace("[[", "[").replace("]]", "]")
}

/**
 * Checks whether or not a template string contains totally valid syntax (simply tries running it)
 * @param string The string to test for valid syntax - this may contain no templates and will be considered valid.
 * @returns {boolean} Whether or not the input string is valid.
 */
module.exports.isValid = string => {
  const validCases = ["string", "number", "object", "array"]
  // this is a portion of a specific string always output by handlebars in the case of a syntax error
  const invalidCases = [`expecting 'id', 'string', 'number'`]
  // don't really need a real context to check if its valid
  const context = {}
  try {
    hbsInstance.compile(processors.preprocess(string, false))(context)
    return true
  } catch (err) {
    const msg = err && err.message ? err.message : err
    if (!msg) {
      return false
    }
    const invalidCase = invalidCases.some(invalidCase =>
      msg.toLowerCase().includes(invalidCase)
    )
    const validCase = validCases.some(validCase =>
      msg.toLowerCase().includes(validCase)
    )
    // special case for maths functions - don't have inputs yet
    return validCase && !invalidCase
  }
}

/**
 * We have generated a static manifest file from the helpers that this string templating package makes use of.
 * This manifest provides information about each of the helpers and how it can be used.
 * @returns The manifest JSON which has been generated from the helpers.
 */
module.exports.getManifest = () => {
  return manifest
}
