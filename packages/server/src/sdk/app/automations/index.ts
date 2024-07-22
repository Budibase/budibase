import * as crud from "./crud"
import * as webhook from "./webhook"
import * as utils from "./utils"

export default {
  ...crud,
  webhook,
  utils,
}
