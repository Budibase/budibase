import * as applications from "./applications"
import * as imports from "./import"
import * as sync from "./sync"
import * as utils from "./utils"

export default {
  ...sync,
  ...utils,
  ...applications,
  ...imports,
}
