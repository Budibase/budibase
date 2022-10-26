import { default as backups } from "./app/backups"
import { default as tables } from "./app/tables"

const sdk = {
  backups,
  tables,
}

// default export for TS
export default sdk

// default export for JS
module.exports = sdk
