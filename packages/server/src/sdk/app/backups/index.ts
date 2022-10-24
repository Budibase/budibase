import * as exportApps from "./exports"
import * as importApps from "./imports"
import * as backup from "./backup"
import * as statistics from "./statistics"

export default {
  ...exportApps,
  ...importApps,
  ...backup,
  ...statistics,
}
