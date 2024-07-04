import { default as applications } from "./app/applications"
import { default as automations } from "./app/automations"
import { default as backups } from "./app/backups"
import { default as datasources } from "./app/datasources"
import { default as links } from "./app/links"
import * as permissions from "./app/permissions"
import { default as queries } from "./app/queries"
import { default as rows } from "./app/rows"
import { default as tables } from "./app/tables"
import * as views from "./app/views"
import { default as plugins } from "./plugins"
import { default as users } from "./users"

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
  views,
  permissions,
  links,
}

// default export for TS
export default sdk
