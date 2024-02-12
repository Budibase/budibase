import vm from "vm"
import templates from "./index.js"

/**
 * ES6 entrypoint for rollup
 */
export const isValid = templates.isValid
export const makePropSafe = templates.makePropSafe
export const getManifest = templates.getManifest
export const isJSBinding = templates.isJSBinding
export const encodeJSBinding = templates.encodeJSBinding
export const decodeJSBinding = templates.decodeJSBinding
export const processStringSync = templates.processStringSync
export const processObjectSync = templates.processObjectSync
export const processString = templates.processString
export const processObject = templates.processObject
export const doesContainStrings = templates.doesContainStrings
export const doesContainString = templates.doesContainString
export const disableEscaping = templates.disableEscaping
export const findHBSBlocks = templates.findHBSBlocks
export const convertToJS = templates.convertToJS
export const setJSRunner = templates.setJSRunner
export const setOnErrorLog = templates.setOnErrorLog
export const FIND_ANY_HBS_REGEX = templates.FIND_ANY_HBS_REGEX
export const helpersToRemoveForJs = templates.helpersToRemoveForJs

if (process && !process.env.NO_JS) {
  /**
   * Use polyfilled vm to run JS scripts in a browser Env
   */
  setJSRunner((js, context) => {
    context = {
      ...context,
      alert: undefined,
      setInterval: undefined,
      setTimeout: undefined,
    }
    vm.createContext(context)
    return vm.runInNewContext(js, context, { timeout: 1000 })
  })
}

export * from "./errors.js"
