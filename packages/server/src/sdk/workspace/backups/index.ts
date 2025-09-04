import * as exportApps from "./exports"
import * as importApps from "./imports"
import * as statistics from "./statistics"
import * as errors from "./errors"

export default {
  ...exportApps,
  ...importApps,
  ...statistics,
  ...errors,
}
