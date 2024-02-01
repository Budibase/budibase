const { getJsHelperList } = require("./helpers/list")

const helpers = getJsHelperList()
module.exports = {
  ...helpers,
  // pointing stripProtocol to a unexisting function to be able to declare it on isolated-vm
  // eslint-disable-next-line no-undef
  stripProtocol: helpersStripProtocol,
}
