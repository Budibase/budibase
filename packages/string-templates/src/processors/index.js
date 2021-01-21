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

module.exports.preprocess = string => {
  return process(string, preprocessor.processors)
}

module.exports.postprocess = string => {
  return process(string, postprocessor.processors)
}
