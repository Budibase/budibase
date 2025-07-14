import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import { allRoutes } from "./endpointGroups"

import "./auth"
import "./layout"
import "./screen"
import "./user"
import "./application"
import "./table"
import "./row"
import "./view"
import "./component"
import "./automation"
import "./webhook"
import "./role"
import "./deploy"
import "./apikeys"
import "./templates"
import "./analytics"
import "./routing"
import "./integration"
import "./permission"
import "./datasource"
import "./query"
import "./backup"
import "./metadata"
import "./dev"
import "./migrations"
import "./plugin"
import "./ops"
import "./debug"
import "./rowAction"
import "./oauth2"
import "./features"
import "./ai"
import "./workspaceApp"
import "./navigation"
import "./resource"

export { default as staticRoutes } from "./static"
export { default as publicRoutes } from "./public"
export { default as assetRoutes } from "./assets"

const appBackupRoutes = pro.appBackups
const environmentVariableRoutes = pro.environmentVariables
const appRoutes = allRoutes().map(group => group.apply())

export const mainRoutes: Router[] = [
  ...appRoutes,
  appBackupRoutes,
  environmentVariableRoutes,
]
