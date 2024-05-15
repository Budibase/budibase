import { populateExternalTableSchemas } from "./validation"
import * as getters from "./getters"
import * as updates from "./update"
import * as utils from "./utils"
import { migrate } from "./migration"
import * as sqs from "./internal/sqs"

export default {
  populateExternalTableSchemas,
  ...updates,
  ...getters,
  ...utils,
  migrate,
  sqs,
}
