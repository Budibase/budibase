import * as exportApps from "./exports"
import * as importApps from "./imports"
import * as backup from "./backup"

export default {
  ...exportApps,
  ...importApps,
  ...backup,
}
