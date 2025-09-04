import * as ai from "./app/ai"
import { default as automations } from "./app/automations"
import { default as backups } from "./app/backups"
import * as common from "./app/common"
import { default as datasources } from "./app/datasources"
import { default as deployment } from "./app/deployment"
import { default as links } from "./app/links"
import * as navigation from "./app/navigation"
import * as oauth2 from "./app/oauth2"
import * as permissions from "./app/permissions"
import { default as queries } from "./app/queries"
import * as resources from "./app/resources"
import * as rowActions from "./app/rowActions"
import { default as rows } from "./app/rows"
import * as screens from "./app/screens"
import { default as tables } from "./app/tables"
import * as views from "./app/views"
import * as workspaceApps from "./app/workspaceApps"
import { default as applications } from "./app/workspaces"
import * as dev from "./dev"
import * as plugins from "./plugins"
import { default as users } from "./users"
import * as workspace from "./workspace"

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
  navigation,
  resources,
  deployment,
  dev,
  workspace,
}

// default export for TS
export default sdk
