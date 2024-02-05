import getJsHelperList from '@budibase/string-templates/js-helpers'

const helpers = getJsHelperList()
module.exports = {
  ...helpers,
  // pointing stripProtocol to a unexisting function to be able to declare it on isolated-vm
  // @ts-ignore
  // eslint-disable-next-line no-undef  
  stripProtocol: helpersStripProtocol,
}
