import { atob, isBackendService, isJSAllowed } from "../utilities"
import { LITERAL_MARKER } from "../helpers/constants"
import { getJsHelperList } from "./list"
import { iifeWrapper } from "../iife"
import { JsTimeoutError, UserScriptError } from "../errors"
import { cloneDeep } from "lodash/fp"

// The method of executing JS scripts depends on the bundle being built.
// This setter is used in the entrypoint (either index.js or index.mjs).
let runJS: ((js: string, context: Record<string, any>) => any) | undefined =
  undefined
export const setJSRunner = (runner: typeof runJS) => (runJS = runner)

export const removeJSRunner = () => {
  runJS = undefined
}

let onErrorLog: (message: Error) => void
export const setOnErrorLog = (delegate: typeof onErrorLog) =>
  (onErrorLog = delegate)

// Helper utility to strip square brackets from a value
const removeSquareBrackets = (value: string) => {
  if (!value || typeof value !== "string") {
    return value
  }
  const regex = /\[+(.+)]+/
  const matches = value.match(regex)
  if (matches && matches[1]) {
    return matches[1]
  }
  return value
}

const isReservedKey = (key: string) =>
  key === "snippets" ||
  key === "helpers" ||
  key.startsWith("snippets.") ||
  key.startsWith("helpers.")

// Our context getter function provided to JS code as $.
// Extracts a value from context.
const getContextValue = (path: string, context: any) => {
  // We populate `snippets` ourselves, don't allow access to it.
  if (isReservedKey(path)) {
    return undefined
  }
  const literalStringRegex = /^(["'`]).*\1$/
  let data = context
  // check if it's a literal string - just return path if its quoted
  if (literalStringRegex.test(path)) {
    return path.substring(1, path.length - 1)
  }
  path.split(".").forEach(key => {
    if (data == null || typeof data !== "object") {
      return null
    }
    data = data[removeSquareBrackets(key)]
  })

  return data
}

// Evaluates JS code against a certain context
export function processJS(handlebars: string, context: any) {
  if (!isJSAllowed() || !runJS) {
    throw new Error("JS disabled in environment.")
  }
  try {
    // Wrap JS in a function and immediately invoke it.
    // This is required to allow the final `return` statement to be valid.
    const js = iifeWrapper(atob(handlebars))

    // Transform snippets into an object for faster access, and cache previously
    // evaluated snippets
    let snippetMap: any = {}
    let snippetCache: any = {}
    for (let snippet of context.snippets || []) {
      snippetMap[snippet.name] = snippet.code
    }

    let clonedContext: Record<string, any>
    if (isBackendService()) {
      // On the backned, values are copied across the isolated-vm boundary and
      // so we don't need to do any cloning here. This does create a fundamental
      // difference in how JS executes on the frontend vs the backend, e.g.
      // consider this snippet:
      //
      //   $("array").push(2)
      //   return $("array")[1]
      //
      // With the context of `{ array: [1] }`, the backend will return
      // `undefined` whereas the frontend will return `2`. We should fix this.
      clonedContext = context
    } else {
      clonedContext = cloneDeep(context)
    }

    const sandboxContext = {
      $: (path: string) => getContextValue(path, clonedContext),
      helpers: getJsHelperList(),

      // Proxy to evaluate snippets when running in the browser
      snippets: new Proxy(
        {},
        {
          get: function (_, name) {
            if (!(name in snippetCache)) {
              snippetCache[name] = eval(iifeWrapper(snippetMap[name]))
            }
            return snippetCache[name]
          },
        }
      ),
    }

    // Create a sandbox with our context and run the JS
    const res = { data: runJS(js, sandboxContext) }
    return `{{${LITERAL_MARKER} js_result-${JSON.stringify(res)}}}`
  } catch (error: any) {
    onErrorLog && onErrorLog(error)

    const { noThrow = true } = context.__opts || {}

    // The error handling below is quite messy, because it has fallen to
    // string-templates to handle a variety of types of error specific to usages
    // above it in the stack. It would be nice some day to refactor this to
    // allow each user of processStringSync to handle errors in the way they see
    // fit.

    // This is to catch the error vm.runInNewContext() throws when the timeout
    // is exceeded.
    if (error.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
      return "Timed out while executing JS"
    }

    // This is to catch the JsRequestTimeoutError we throw when we detect a
    // timeout across an entire request in the backend. We use a magic string
    // because we can't import from the backend into string-templates.
    if (error.code === "JS_REQUEST_TIMEOUT_ERROR") {
      return error.message
    }

    // This is to catch the JsTimeoutError we throw when we detect a timeout in
    // a single JS execution.
    if (error.code === JsTimeoutError.code) {
      return JsTimeoutError.message
    }

    // This is to catch the error that happens if a user-supplied JS script
    // throws for reasons introduced by the user.
    if (error.code === UserScriptError.code) {
      if (noThrow) {
        return error.userScriptError.toString()
      }
      throw error
    }

    if (error.name === "SyntaxError") {
      if (noThrow) {
        return error.toString()
      }
      throw error
    }

    return "Error while executing JS"
  }
}
