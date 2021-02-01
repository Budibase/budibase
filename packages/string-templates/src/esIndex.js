import templates from "./index"

/**
 * This file is simply an entrypoint for rollup - makes a lot of cjs problems go away
 */
export const isValid = templates.isValid
export const makePropSafe = templates.makePropSafe
export const getManifest = templates.getManifest
export const processStringSync = templates.processStringSync
export const processObjectSync = templates.processObjectSync
export const processString = templates.processString
export const processObject = templates.processObject
