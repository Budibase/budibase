import * as crud from "./crud"
import * as webhook from "./webhook"
import * as utils from "./utils"
import * as execution from "./execution"

export default {
  ...crud,
  webhook,
  utils,
  execution,
}
