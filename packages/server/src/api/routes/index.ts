import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import { allRoutes } from "./endpointGroups"

export { default as staticRoutes } from "./static"
export { default as publicRoutes } from "./public"
export { default as assetRoutes } from "./assets"

const appBackupRoutes = pro.appBackups
const environmentVariableRoutes = pro.environmentVariables

export const mainRoutes: Router[] = [
  ...allRoutes().map(group => group.apply()),
  appBackupRoutes,
  environmentVariableRoutes,
]
