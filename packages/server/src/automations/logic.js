let filter = require("./steps/filter")
let delay = require("./steps/delay")

let LOGIC_IMPLS = {
  DELAY: delay.run,
  FILTER: filter.run,
}

let LOGIC_DEFINITIONS = {
  DELAY: delay.definition,
  FILTER: filter.definition,
}

exports.getLogic = function (logicName) {
  if (LOGIC_IMPLS[logicName] != null) {
    return LOGIC_IMPLS[logicName]
  }
}

exports.LOGIC_DEFINITIONS = LOGIC_DEFINITIONS
