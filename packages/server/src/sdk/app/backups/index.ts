import * as exportApps from "./exports"
import * as importApps from "./imports"
import * as statistics from "./statistics"

export default {
  ...exportApps,
  ...importApps,
  ...statistics,
}
