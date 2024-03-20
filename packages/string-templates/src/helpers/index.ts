import Helper from "./Helper"
import Handlebars from "handlebars"
import * as externalHandlebars from "./external"
import { processJS } from "./javascript"
import {
  HelperFunctionNames,
  HelperFunctionBuiltin,
  LITERAL_MARKER,
} from "./constants"

export { getJsHelperList } from "./list"

const HTML_SWAPS = {
  "<": "&lt;",
  ">": "&gt;",
}

function isObject(value: string | any[]) {
  if (value == null || typeof value !== "object") {
    return false
  }
  return (
    value.toString() === "[object Object]" ||
    (value.length > 0 && typeof value[0] === "object")
  )
}

const HELPERS = [
  // external helpers
  new Helper(HelperFunctionNames.OBJECT, (value: any) => {
    return new Handlebars.SafeString(JSON.stringify(value))
  }),
  // javascript helper
  new Helper(HelperFunctionNames.JS, processJS, false),
  // this help is applied to all statements
  new Helper(
    HelperFunctionNames.ALL,
    (value: string, inputs: { __opts: any }) => {
      const { __opts } = inputs
      if (isObject(value)) {
        return new Handlebars.SafeString(JSON.stringify(value))
      }
      // null/undefined values produce bad results
      if (__opts && __opts.onlyFound && value == null) {
        return __opts.input
      }
      if (value == null || typeof value !== "string") {
        return value == null ? "" : value
      }
      // TODO: check, this should always be false
      if (value && (value as any).string) {
        value = (value as any).string
      }
      let text: any = value
      if (__opts && __opts.escapeNewlines) {
        text = value.replace(/\n/g, "\\n")
      }
      text = new Handlebars.SafeString(text.replace(/&amp;/g, "&"))
      if (text == null || typeof text !== "string") {
        return text
      }
      return text.replace(/[<>]/g, (tag: string) => {
        return HTML_SWAPS[tag as keyof typeof HTML_SWAPS] || tag
      })
    }
  ),
  // adds a note for post-processor
  new Helper(HelperFunctionNames.LITERAL, (value: any) => {
    if (value === undefined) {
      return ""
    }
    const type = typeof value
    const outputVal = type === "object" ? JSON.stringify(value) : value
    return `{{${LITERAL_MARKER} ${type}-${outputVal}}}`
  }),
]

export function HelperNames() {
  return Object.values(HelperFunctionNames).concat(
    HelperFunctionBuiltin,
    externalHandlebars.externalHelperNames
  )
}

export function registerMinimum(handlebars: typeof Handlebars) {
  for (let helper of HELPERS) {
    helper.register(handlebars)
  }
}

export function registerAll(handlebars: typeof Handlebars) {
  registerMinimum(handlebars)
  // register imported helpers
  externalHandlebars.registerAll(handlebars)
}

export function unregisterAll(handlebars: any) {
  for (let helper of HELPERS) {
    helper.unregister(handlebars)
  }
  // unregister all imported helpers
  externalHandlebars.unregisterAll(handlebars)
}
