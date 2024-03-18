import { FIND_HBS_REGEX } from "../utilities"
import * as preprocessor from "./preprocessor"
import * as postprocessor from "./postprocessor"
import { ProcessOptions } from "../types"
import { Processor } from "./processor"

function process(
  output: string,
  processors: Processor[],
  opts?: ProcessOptions
) {
  for (const processor of processors) {
    // if a literal statement has occurred stop
    if (typeof output !== "string") {
      break
    }
    // re-run search each time incase previous processor updated/removed a match
    const regexp = new RegExp(FIND_HBS_REGEX)
    const matches = output.match(regexp)
    if (matches == null) {
      continue
    }
    for (const match of matches) {
      output = processor.process(output, match, opts)
    }
  }
  return output
}

export function preprocess(string: string, opts: ProcessOptions) {
  let processors = preprocessor.processors
  if (opts.noFinalise) {
    processors = processors.filter(
      processor => processor.name !== preprocessor.PreprocessorNames.FINALISE
    )
  }
  return process(string, processors, opts)
}
export function postprocess(string: string) {
  const processors = postprocessor.processors
  return process(string, processors)
}
