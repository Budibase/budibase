const handlebars = require("handlebars")
const { registerAll } = require("./helpers/index")
const processors = require("./processors")
const { removeHandlebarsStatements, atob, btoa } = require("./utilities")
const manifest = require("../manifest.json")

const hbsInstance = handlebars.create()
registerAll(hbsInstance)
const hbsInstanceNoHelpers = handlebars.create()

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
 * @param {object} opts optional - specify some options for processing.
 * @returns {Promise<object|array>} The structure input, as fully updated as possible.
 */
module.exports.processObject = async (
  object,
  context,
  opts = { noHelpers: false }
) => {
  testObject(object)
  for (let key of Object.keys(object || {})) {
    if (object[key] != null) {
      let val = object[key]
      if (typeof val === "string") {
        object[key] = await module.exports.processString(
          object[key],
          context,
          opts
        )
      } else if (typeof val === "object") {
        object[key] = await module.exports.processObject(
          object[key],
          context,
          opts
        )
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
 * @param {object} opts optional - specify some options for processing.
 * @returns {Promise<string>} The enriched string, all templates should have been replaced if they can be.
 */
module.exports.processString = async (
  string,
  context,
  opts = { noHelpers: false }
) => {
  // TODO: carry out any async calls before carrying out async call
  return module.exports.processStringSync(string, context, opts)
}

/**
 * Given an input object this will recurse through all props to try and update any handlebars statements within. This is
 * a pure sync call and therefore does not have the full functionality of the async call.
 * @param {object|array} object The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @param {object} opts optional - specify some options for processing.
 * @returns {object|array} The structure input, as fully updated as possible.
 */
module.exports.processObjectSync = (
  object,
  context,
  opts = { noHelpers: false }
) => {
  testObject(object)
  for (let key of Object.keys(object || {})) {
    let val = object[key]
    if (typeof val === "string") {
      object[key] = module.exports.processStringSync(object[key], context, opts)
    } else if (typeof val === "object") {
      object[key] = module.exports.processObjectSync(object[key], context, opts)
    }
  }
  return object
}

/**
 * This will process a single handlebars containing string. If the string passed in has no valid handlebars statements
 * then nothing will occur. This is a pure sync call and therefore does not have the full functionality of the async call.
 * @param {string} string The template string which is the filled from the context object.
 * @param {object} context An object of information which will be used to enrich the string.
 * @param {object} opts optional - specify some options for processing.
 * @returns {string} The enriched string, all templates should have been replaced if they can be.
 */
module.exports.processStringSync = (
  string,
  context,
  opts = { noHelpers: false }
) => {
  if (!exports.isValid(string)) {
    return string
  }
  // take a copy of input incase error
  const input = string
  if (typeof string !== "string") {
    throw "Cannot process non-string types."
  }
  try {
    const noHelpers = opts && opts.noHelpers
    // finalising adds a helper, can't do this with no helpers
    const shouldFinalise = !noHelpers
    string = processors.preprocess(string, shouldFinalise)
    // this does not throw an error when template can't be fulfilled, have to try correct beforehand
    const instance = noHelpers ? hbsInstanceNoHelpers : hbsInstance
    const template = instance.compile(string, {
      strict: false,
    })
    return processors.postprocess(
      template({
        now: new Date().toISOString(),
        ...context,
      })
    )
  } catch (err) {
    return removeHandlebarsStatements(input)
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
 * @param opts optional - specify some options for processing.
 * @returns {boolean} Whether or not the input string is valid.
 */
module.exports.isValid = (string, opts = { noHelpers: false }) => {
  const validCases = [
    "string",
    "number",
    "object",
    "array",
    "cannot read property",
    "undefined",
  ]
  // this is a portion of a specific string always output by handlebars in the case of a syntax error
  const invalidCases = [`expecting '`]
  // don't really need a real context to check if its valid
  const context = {}
  try {
    const instance = opts && opts.noHelpers ? hbsInstanceNoHelpers : hbsInstance
    instance.compile(processors.preprocess(string, false))(context)
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

/**
 * Checks if a HBS expression is a valid JS HBS expression
 * @param handlebars the HBS expression to check
 * @returns {boolean} whether the expression is JS or not
 */
module.exports.isJSBinding = handlebars => {
  return module.exports.decodeJSBinding(handlebars) != null
}

/**
 * Encodes a raw JS string as a JS HBS expression
 * @param javascript the JS code to encode
 * @returns {string} the JS HBS expression
 */
module.exports.encodeJSBinding = javascript => {
  return `{{ js "${btoa(javascript)}" }}`
}

/**
 * Decodes a JS HBS expression to the raw JS code
 * @param handlebars the JS HBS expression
 * @returns {string|null} the raw JS code
 */
module.exports.decodeJSBinding = handlebars => {
  if (!handlebars || typeof handlebars !== "string") {
    return null
  }

  // JS is only valid if it is the only HBS expression
  if (!handlebars.trim().startsWith("{{ js ")) {
    return null
  }

  const captureJSRegex = new RegExp(/{{ js "(.*)" }}/)
  const match = handlebars.match(captureJSRegex)
  if (!match || match.length < 2) {
    return null
  }
  return atob(match[1])
}
