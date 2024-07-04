import * as getters from "./getters"
import * as sqs from "./internal/sqs"
import { migrate } from "./migration"
import * as updates from "./update"
import * as utils from "./utils"
import { populateExternalTableSchemas } from "./validation"

export default {
  populateExternalTableSchemas,
  ...updates,
  ...getters,
  ...utils,
  migrate,
  sqs,
}
