const { FIND_HBS_REGEX } = require("../utilities")
const preprocessor = require("./preprocessor")
const postprocessor = require("./postprocessor")
const { tracer } = require("dd-trace")

function process(output, processors, opts) {
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

module.exports.preprocess = (string, opts) => {
  return tracer.trace("preprocess", {}, () => {
    let processors = preprocessor.processors
    if (opts.noFinalise) {
      processors = processors.filter(
        processor => processor.name !== preprocessor.PreprocessorNames.FINALISE
      )
    }
    return process(string, processors, opts)
  })
}
module.exports.postprocess = string => {
  return tracer.trace("postprocess", {}, () => {
    let processors = postprocessor.processors
    return process(string, processors)
  })
}
