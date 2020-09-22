let filter = require("./steps/filter")
let delay = require("./steps/delay")

let BUILTIN_LOGIC = {
  DELAY: delay.run,
  FILTER: filter.run,
}

let BUILTIN_DEFINITIONS = {
  DELAY: delay.definition,
  FILTER: filter.definition,
}

module.exports.getLogic = function(logicName) {
  if (BUILTIN_LOGIC[logicName] != null) {
    return BUILTIN_LOGIC[logicName]
  }
}

module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
