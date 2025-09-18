import * as dev from "./dev"
import * as plugins from "./plugins"
import { default as users } from "./users"
import * as ai from "./workspace/ai"
import { default as automations } from "./workspace/automations"
import { default as backups } from "./workspace/backups"
import * as common from "./workspace/common"
import { default as datasources } from "./workspace/datasources"
import { default as deployment } from "./workspace/deployment"
import * as workspace from "./workspace/favourites"
import { default as links } from "./workspace/links"
import * as navigation from "./workspace/navigation"
import * as oauth2 from "./workspace/oauth2"
import * as permissions from "./workspace/permissions"
import { default as queries } from "./workspace/queries"
import * as resources from "./workspace/resources"
import * as rowActions from "./workspace/rowActions"
import { default as rows } from "./workspace/rows"
import * as screens from "./workspace/screens"
import { default as tables } from "./workspace/tables"
import * as views from "./workspace/views"
import * as workspaceApps from "./workspace/workspaceApps"
import { default as applications } from "./workspace/workspaces"

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
