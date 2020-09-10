const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

let LOGIC = {
  DELAY: async function delay({ args }) {
    await wait(args.time)
  },

  FILTER: async function filter({ args }) {
    const { field, condition, value } = args
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
