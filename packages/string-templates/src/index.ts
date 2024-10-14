import { createContext, runInNewContext } from "vm"
import { create, TemplateDelegate } from "handlebars"
import { registerAll, registerMinimum } from "./helpers/index"
import { postprocess, preprocess } from "./processors"
import {
  atob,
  btoa,
  FIND_ANY_HBS_REGEX,
  FIND_HBS_REGEX,
  findDoubleHbsInstances,
  isBackendService,
  prefixStrings,
} from "./utilities"
import { convertHBSBlock } from "./conversion"
import { removeJSRunner, setJSRunner } from "./helpers/javascript"

import manifest from "./manifest.json"
import { ProcessOptions } from "./types"
import { UserScriptError } from "./errors"

export { helpersToRemoveForJs, getJsHelperList } from "./helpers/list"
export { FIND_ANY_HBS_REGEX } from "./utilities"
export { setJSRunner, setOnErrorLog } from "./helpers/javascript"
export { iifeWrapper } from "./iife"

const hbsInstance = create()
registerAll(hbsInstance)
const helperNames = Object.keys(hbsInstance.helpers)
const hbsInstanceNoHelpers = create()
registerMinimum(hbsInstanceNoHelpers)
const defaultOpts: ProcessOptions = {
  noHelpers: false,
  cacheTemplates: false,
  noEscaping: false,
  escapeNewlines: false,
  noFinalise: false,
}

/**
 * Utility function to check if the object is valid.
 */
function testObject(object: any) {
  // JSON stringify will fail if there are any cycles, stops infinite recursion
  try {
    JSON.stringify(object)
  } catch (err) {
    throw "Unable to process inputs to JSON, cannot recurse"
  }
}

function findOverlappingHelpers(context?: object) {
  if (!context) {
    return []
  }
  const contextKeys = Object.keys(context)
  return contextKeys.filter(key => helperNames.includes(key))
}

/**
 * Creates a HBS template function for a given string, and optionally caches it.
 */
const templateCache: Record<string, TemplateDelegate<any>> = {}
function createTemplate(
  string: string,
  opts?: ProcessOptions,
  context?: object
) {
  opts = { ...defaultOpts, ...opts }
  const helpersEnabled = !opts?.noHelpers

  // Finalising adds a helper, can't do this with no helpers
  const key = `${string}-${JSON.stringify(opts)}`

  // Reuse the cached template is possible
  if (opts.cacheTemplates && templateCache[key]) {
    return templateCache[key]
  }

  const overlappingHelpers = helpersEnabled
    ? findOverlappingHelpers(context)
    : []

  string = preprocess(string, {
    ...opts,
    disabledHelpers: overlappingHelpers,
  })

  if (context && helpersEnabled) {
    if (overlappingHelpers.length > 0) {
      for (const block of findHBSBlocks(string)) {
        string = string.replace(
          block,
          prefixStrings(block, overlappingHelpers, "./")
        )
      }
    }
  }

  // Optionally disable built in HBS escaping
  if (opts.noEscaping) {
    string = disableEscaping(string)
  }

  // This does not throw an error when template can't be fulfilled,
  // have to try correct beforehand
  const instance = opts.noHelpers ? hbsInstanceNoHelpers : hbsInstance

  const template = instance.compile(string, {
    strict: false,
  })
  templateCache[key] = template
  return template
}

/**
 * Given an input object this will recurse through all props to try and update any handlebars statements within.
 * @param {object|array} object The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @param {object|undefined} [opts] optional - specify some options for processing.
 * @returns {Promise<object|array>} The structure input, as fully updated as possible.
 */
export async function processObject<T extends Record<string, any>>(
  object: T,
  context: object,
  opts?: ProcessOptions
): Promise<T> {
  testObject(object)

  for (const key of Object.keys(object || {})) {
    if (object[key] != null) {
      const val = object[key]
      let parsedValue = val
      if (typeof val === "string") {
        parsedValue = await processString(object[key], context, opts)
      } else if (typeof val === "object") {
        parsedValue = await processObject(object[key], context, opts)
      }

      // @ts-ignore
      object[key] = parsedValue
    }
  }
  return object
}

/**
 * This will process a single handlebars containing string. If the string passed in has no valid handlebars statements
 * then nothing will occur.
 * @param {string} string The template string which is the filled from the context object.
 * @param {object} context An object of information which will be used to enrich the string.
 * @param {object|undefined} [opts] optional - specify some options for processing.
 * @returns {Promise<string>} The enriched string, all templates should have been replaced if they can be.
 */
export async function processString(
  string: string,
  context: object,
  opts?: ProcessOptions
): Promise<string> {
  // TODO: carry out any async calls before carrying out async call
  return processStringSync(string, context, opts)
}

/**
 * Given an input object this will recurse through all props to try and update any handlebars statements within. This is
 * a pure sync call and therefore does not have the full functionality of the async call.
 * @param {object|array} object The input structure which is to be recursed, it is important to note that
 * if the structure contains any cycles then this will fail.
 * @param {object} context The context that handlebars should fill data from.
 * @param {object|undefined} [opts] optional - specify some options for processing.
 * @returns {object|array} The structure input, as fully updated as possible.
 */
export function processObjectSync(
  object: { [x: string]: any },
  context: any,
  opts?: ProcessOptions
): object | Array<any> {
  testObject(object)
  for (let key of Object.keys(object || {})) {
    let val = object[key]
    if (typeof val === "string") {
      object[key] = processStringSync(object[key], context, opts)
    } else if (typeof val === "object") {
      object[key] = processObjectSync(object[key], context, opts)
    }
  }
  return object
}

/**
 * This will process a single handlebars containing string. If the string passed in has no valid handlebars statements
 * then nothing will occur. This is a pure sync call and therefore does not have the full functionality of the async call.
 * @param {string} string The template string which is the filled from the context object.
 * @param {object} context An object of information which will be used to enrich the string.
 * @param {object|undefined} [opts] optional - specify some options for processing.
 * @returns {string} The enriched string, all templates should have been replaced if they can be.
 */
export function processStringSync(
  string: string,
  context?: object,
  opts?: ProcessOptions
): string {
  // Take a copy of input in case of error
  const input = string
  if (typeof string !== "string") {
    throw "Cannot process non-string types."
  }
  function process(stringPart: string) {
    // context is needed to check for overlap between helpers and context
    const template = createTemplate(stringPart, opts, context)
    const now = Math.floor(Date.now() / 1000) * 1000
    const processedString = template({
      now: new Date(now).toISOString(),
      __opts: {
        ...opts,
        input: stringPart,
      },
      ...context,
    })
    return postprocess(processedString)
  }
  try {
    if (opts && opts.onlyFound) {
      const blocks = findHBSBlocks(string)
      for (let block of blocks) {
        const outcome = process(block)
        string = string.replace(block, outcome)
      }
      return string
    } else {
      return process(string)
    }
  } catch (err: any) {
    const { noThrow = true } = opts || {}
    if (noThrow) {
      return input
    }
    throw err
  }
}

/**
 * By default with expressions like {{ name }} handlebars will escape various
 * characters, which can be problematic. To fix this we use the syntax {{{ name }}},
 * this function will find any double braces and switch to triple.
 * @param string the string to have double HBS statements converted to triple.
 */
export function disableEscaping(string: string) {
  const matches = findDoubleHbsInstances(string)
  if (matches == null) {
    return string
  }

  // find the unique set
  const unique = [...new Set(matches)]
  for (let match of unique) {
    // add a negative lookahead to exclude any already
    const regex = new RegExp(`${match}(?!})`, "g")
    string = string.replace(regex, `{${match}}`)
  }
  return string
}

/**
 * Simple utility function which makes sure that a templating property has been wrapped in literal specifiers correctly.
 * @param {string} property The property which is to be wrapped.
 * @returns {string} The wrapped property ready to be added to a templating string.
 */
export function makePropSafe(property: any): string {
  return `[${property}]`.replace("[[", "[").replace("]]", "]")
}

/**
 * Checks whether or not a template string contains totally valid syntax (simply tries running it)
 * @param string The string to test for valid syntax - this may contain no templates and will be considered valid.
 * @param [opts] optional - specify some options for processing.
 * @returns {boolean} Whether or not the input string is valid.
 */
export function isValid(string: any, opts?: any): boolean {
  const validCases = [
    "string",
    "number",
    "object",
    "array",
    "cannot read property",
    "undefined",
    "json at position 0",
  ]
  // this is a portion of a specific string always output by handlebars in the case of a syntax error
  const invalidCases = [`expecting '`]
  // don't really need a real context to check if its valid
  const context = {}
  try {
    const template = createTemplate(string, {
      ...opts,
      noFinalise: true,
    })
    template(context)
    return true
  } catch (err: any) {
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
export function getManifest() {
  return manifest
}

/**
 * Checks if a HBS expression is a valid JS HBS expression
 * @param handlebars the HBS expression to check
 * @returns {boolean} whether the expression is JS or not
 */
export function isJSBinding(handlebars: any): boolean {
  return decodeJSBinding(handlebars) != null
}

/**
 * Encodes a raw JS string as a JS HBS expression
 * @param javascript the JS code to encode
 * @returns {string} the JS HBS expression
 */
export function encodeJSBinding(javascript: string): string {
  return `{{ js "${btoa(javascript)}" }}`
}

/**
 * Decodes a JS HBS expression to the raw JS code
 * @param handlebars the JS HBS expression
 * @returns {string|null} the raw JS code
 */
export function decodeJSBinding(handlebars: string): string | null {
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

/**
 * Same as the doesContainString function, but will check for all the strings
 * before confirming it contains.
 * @param {string} template The template string to search.
 * @param {string[]} strings The strings to look for.
 * @returns {boolean} Will return true if all strings found in HBS statement.
 */
export function doesContainStrings(template: string, strings: any[]): boolean {
  let regexp = new RegExp(FIND_HBS_REGEX)
  let matches = template.match(regexp)
  if (matches == null) {
    return false
  }
  for (let match of matches) {
    let hbs = match
    if (isJSBinding(match)) {
      hbs = decodeJSBinding(match)!
    }
    let allFound = true
    for (let string of strings) {
      if (!hbs.includes(string)) {
        allFound = false
      }
    }
    if (allFound) {
      return true
    }
  }
  return false
}

/**
 * Given a string, this will return any {{ binding }} or {{{ binding }}} type
 * statements.
 * @param {string} string The string to search within.
 * @return {string[]} The found HBS blocks.
 */
export function findHBSBlocks(string: string): string[] {
  if (!string || typeof string !== "string") {
    return []
  }
  let regexp = new RegExp(FIND_ANY_HBS_REGEX)
  let matches = string.match(regexp)
  if (matches == null) {
    return []
  }
  return matches
}

/**
 * This function looks in the supplied template for handlebars instances, if they contain
 * JS the JS will be decoded and then the supplied string will be looked for. For example
 * if the template "Hello, your name is {{ related }}" this function would return that true
 * for the string "related" but not for "name" as it is not within the handlebars statement.
 * @param {string} template A template string to search for handlebars instances.
 * @param {string} string The word or sentence to search for.
 * @returns {boolean} The this return true if the string is found, false if not.
 */
export function doesContainString(template: any, string: any): boolean {
  return doesContainStrings(template, [string])
}

export function convertToJS(hbs: string) {
  const blocks = findHBSBlocks(hbs)
  let js = "return `",
    prevBlock: string | null = null
  const variables: Record<string, any> = {}
  if (blocks.length === 0) {
    js += hbs
  }
  let count = 1
  for (let block of blocks) {
    let stringPart = hbs
    if (prevBlock) {
      stringPart = stringPart.split(prevBlock)[1]
    }
    stringPart = stringPart.split(block)[0]
    prevBlock = block
    const { variable, value } = convertHBSBlock(block, count++)
    variables[variable] = value
    js += `${[stringPart]}\${${variable}}`
  }
  let varBlock = ""
  for (let [variable, value] of Object.entries(variables)) {
    varBlock += `const ${variable} = ${value};\n`
  }
  js += "`;"
  return `${varBlock}${js}`
}

export { JsTimeoutError, UserScriptError } from "./errors"

export function browserJSSetup() {
  /**
   * Use polyfilled vm to run JS scripts in a browser Env
   */
  setJSRunner((js: string, context: Record<string, any>) => {
    createContext(context)

    const wrappedJs = `
        result = {
          result: null,
          error: null,
        };

        try {
          result.result = ${js};
        } catch (e) {
          result.error = e;
        }

        result;
      `

    const result = runInNewContext(wrappedJs, context, { timeout: 1000 })
    if (result.error) {
      throw new UserScriptError(result.error)
    }
    return result.result
  })
}

export function defaultJSSetup() {
  if (!isBackendService()) {
    browserJSSetup()
  } else {
    removeJSRunner()
  }
}
defaultJSSetup()
