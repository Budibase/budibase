const { getJsHelperList } = require("./helpers/list")

const helpers = getJsHelperList()
module.exports = {
  ...helpers,
  // point stripProtocol to a unexisting function to be able to declare it on isolated-vm
  stripProtocol: helpersStripProtocol,
}
