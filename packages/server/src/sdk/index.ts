import { default as backups } from "./app/backups"
import { default as tables } from "./app/tables"
import { default as automations } from "./app/automations"
import { default as applications } from "./app/applications"

const sdk = {
  backups,
  tables,
  automations,
  applications,
}

// default export for TS
export default sdk
