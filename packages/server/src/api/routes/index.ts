import layoutRoutes from "./layout"
import screenRoutes from "./screen"
import userRoutes from "./user"
import tableRoutes from "./table"
import rowRoutes from "./row"
import viewRoutes from "./view"
import webhookRoutes from "./webhook"
import roleRoutes from "./role"
import templatesRoutes from "./templates"
import routingRoutes from "./routing"
import integrationRoutes from "./integration"
import permissionRoutes from "./permission"
import queryRoutes from "./query"
import metadataRoutes from "./metadata"
import migrationRoutes from "./migrations"
import pluginRoutes from "./plugin"
import opsRoutes from "./ops"
import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import rowActionRoutes from "./rowAction"
import oauth2Routes from "./oauth2"
import featuresRoutes from "./features"
import workspaceAppsRoutes from "./workspaceApp"
import navigationRoutes from "./navigation"
import resourceRoutes from "./resource"
import { allRoutes } from "./endpointGroups"

export { default as staticRoutes } from "./static"
export { default as publicRoutes } from "./public"

const appBackupRoutes = pro.appBackups
const environmentVariableRoutes = pro.environmentVariables

export const mainRoutes: Router[] = [
  ...allRoutes().map(group => group.apply()),
  appBackupRoutes,
  layoutRoutes,
  screenRoutes,
  userRoutes,
  viewRoutes,
  roleRoutes,
  templatesRoutes,
  webhookRoutes,
  routingRoutes,
  integrationRoutes,
  permissionRoutes,
  queryRoutes,
  metadataRoutes,
  rowRoutes,
  migrationRoutes,
  pluginRoutes,
  opsRoutes,
  environmentVariableRoutes,
  rowActionRoutes,
  oauth2Routes,
  featuresRoutes,
  workspaceAppsRoutes,
  navigationRoutes,
  resourceRoutes,
  // these need to be handled last as they still use /api/:tableId
  // this could be breaking as koa may recognise other routes as this
  tableRoutes,
]
