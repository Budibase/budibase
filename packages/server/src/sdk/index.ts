import { default as backups } from "./app/backups"
import { default as tables } from "./app/tables"

const toExport = {
  backups,
  tables,
}

// default export for TS
export default toExport

// default export for JS
module.exports = toExport
