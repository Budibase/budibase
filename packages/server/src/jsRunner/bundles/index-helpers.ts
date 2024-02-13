const {
  getJsHelperList,
} = require("../../../../string-templates/src/helpers/list.js")

export const helpers = {
  ...getJsHelperList(),
  // pointing stripProtocol to a unexisting function to be able to declare it on isolated-vm
  // @ts-ignore
  // eslint-disable-next-line no-undef
  stripProtocol: helpersStripProtocol,
}
