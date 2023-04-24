import { default as backups } from "./app/backups"
import { default as tables } from "./app/tables"
import { default as automations } from "./app/automations"
import { default as applications } from "./app/applications"
import { default as datasources } from "./app/datasources"
import { default as queries } from "./app/queries"
import { default as rows } from "./app/rows"
import { default as users } from "./users"
import { default as plugins } from "./plugins"

const sdk = {
  backups,
  tables,
  automations,
  applications,
  rows,
  users,
  datasources,
  queries,
  plugins,
}

// default export for TS
export default sdk
