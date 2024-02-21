/**
 * ES6 entrypoint for rollup
 */
export {
  isValid,
  makePropSafe,
  getManifest,
  isJSBinding,
  encodeJSBinding,
  decodeJSBinding,
  processStringSync,
  processObjectSync,
  processString,
  processObject,
  doesContainStrings,
  doesContainString,
  disableEscaping,
  findHBSBlocks,
  convertToJS,
  setJSRunner,
  setOnErrorLog,
  FIND_ANY_HBS_REGEX,
  helpersToRemoveForJs,
} from "./index.js"

export * from "./errors.js"
