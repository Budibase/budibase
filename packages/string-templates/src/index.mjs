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

export * from "./errors.js"
