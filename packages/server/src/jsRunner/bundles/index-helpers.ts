// eslint-disable-next-line local-rules/no-budibase-imports
import { getJsHelperList } from "@budibase/string-templates/src/helpers/list"

export default {
  ...getJsHelperList(),
  // pointing stripProtocol to a unexisting function to be able to declare it on isolated-vm
  // @ts-ignore
  // biome-ignore lint: no-undef
  stripProtocol: helpersStripProtocol,
}
