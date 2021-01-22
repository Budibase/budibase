const { FIND_HBS_REGEX } = require("../utilities")
const preprocessor = require("./preprocessor")
const postprocessor = require("./postprocessor")

function process(string, processors) {
  for (let processor of processors) {
    // re-run search each time incase previous processor updated/removed a match
    let regex = new RegExp(FIND_HBS_REGEX)
    let matches = string.match(regex)
    if (matches == null) {
      continue
    }
    for (let match of matches) {
      string = processor.process(string, match)
    }
  }
  return string
}

module.exports.preprocess = (string, finalise = true) => {
  let processors = preprocessor.processors
  // the pre-processor finalisation stops handlebars from ever throwing an error
  // might want to pre-process for other benefits but still want to see errors
  if (!finalise) {
    processors = processors.filter(
      processor => processor.name !== preprocessor.PreprocessorNames.FINALISE
    )
  }
  return process(string, processors)
}

module.exports.postprocess = string => {
  return process(string, postprocessor.processors)
}
