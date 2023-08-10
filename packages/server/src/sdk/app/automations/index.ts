import * as webhook from "./webhook"
import * as utils from "./utils"
import * as automations from "./automations"

export default {
  webhook,
  utils,
  ...automations,
}
