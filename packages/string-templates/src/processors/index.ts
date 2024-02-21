import { FIND_HBS_REGEX } from "../utilities"
import * as preprocessor from "./preprocessor"
import * as postprocessor from "./postprocessor"

function process(output, processors, opts = {}) {
  for (let processor of processors) {
    // if a literal statement has occurred stop
    if (typeof output !== "string") {
      break
    }
    // re-run search each time incase previous processor updated/removed a match
    let regexp = new RegExp(FIND_HBS_REGEX)
    let matches = output.match(regexp)
    if (matches == null) {
      continue
    }
    for (let match of matches) {
      output = processor.process(output, match, opts)
    }
  }
  return output
}

export function preprocess(string, opts) {
  let processors = preprocessor.processors
  if (opts.noFinalise) {
    processors = processors.filter(
      processor => processor.name !== preprocessor.PreprocessorNames.FINALISE
    )
  }
  return process(string, processors, opts)
}
export function postprocess(string) {
  let processors = postprocessor.processors
  return process(string, processors)
}
