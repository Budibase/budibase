import { FIND_HBS_REGEX } from "../utilities"
import * as preprocessor from "./preprocessor"
import type { Preprocessor } from "./preprocessor"
import * as postprocessor from "./postprocessor"
import type { Postprocessor } from "./postprocessor"
import { Log, ProcessOptions } from "../types"

function process(
  output: string,
  processors: (Preprocessor | Postprocessor)[],
  opts?: ProcessOptions
) {
  let logs: Log[] = []
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
      const res = processor.process(output, match, opts || {})
      if (typeof res === "object") {
        if ("logs" in res && res.logs) {
          logs = logs.concat(res.logs)
        }
        output = res.result
      } else {
        output = res as string
      }
    }
  }
  return { result: output, logs }
}

export function preprocess(string: string, opts: ProcessOptions) {
  let processors = preprocessor.processors
  if (opts.noFinalise) {
    processors = processors.filter(
      processor => processor.name !== preprocessor.PreprocessorNames.FINALISE
    )
  }

  return process(string, processors, opts).result
}

export function postprocess(string: string) {
  return process(string, postprocessor.processors).result
}

export function postprocessWithLogs(string: string) {
  return process(string, postprocessor.processors)
}
