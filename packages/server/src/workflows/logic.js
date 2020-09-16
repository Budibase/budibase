const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

let LOGIC = {
  DELAY: async function delay(inputs) {
    await wait(inputs.time)
  },

  FILTER: async function filter(inputs) {
    const { field, condition, value } = inputs
    switch (condition) {
      case "equals":
        if (field !== value) return
        break
      default:
        return
    }
  },
}

module.exports.getLogic = function(logicName) {
  if (LOGIC[logicName] != null) {
    return LOGIC[logicName]
  }
}

module.exports.LogicConditions = [
  "Equals",
  "Not equals",
  "Greater than",
  "Less than",
]
