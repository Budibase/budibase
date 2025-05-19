import { default as backups } from "./app/backups"
import { default as tables } from "./app/tables"
import { default as automations } from "./app/automations"
import { default as applications } from "./app/applications"
import { default as datasources } from "./app/datasources"
import { default as queries } from "./app/queries"
import { default as rows } from "./app/rows"
import { default as links } from "./app/links"
import { default as users } from "./users"
import * as plugins from "./plugins"
import * as views from "./app/views"
import * as permissions from "./app/permissions"
import * as rowActions from "./app/rowActions"
import * as screens from "./app/screens"
import * as common from "./app/common"
import * as oauth2 from "./app/oauth2"
import * as ai from "./app/ai"
import * as workspaceApps from "./app/workspaceApps"

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
  screens,
  views,
  permissions,
  links,
  rowActions,
  common,
  oauth2,
  ai,
  workspaceApps,
}

// default export for TS
export default sdk
