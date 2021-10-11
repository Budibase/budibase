import templates from "./index.cjs"

/**
 * This file is simply an entrypoint for rollup - makes a lot of cjs problems go away
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
