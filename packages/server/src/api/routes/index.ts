import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import { allRoutes } from "./endpointGroups"

// just need to import routes, they'll include themselves in the
// various groups they need to be included in
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
const appEndpoints = allRoutes().flatMap(group => group.endpointList())
// sort endpoints with a URL parameters after the static endpoints -
// for example, endpoints /api/queries/:queryId and /api/queries/accessible
// can overlap, if the parameter comes before the accessible it'll be unreachable
appEndpoints.sort((a, b) => {
  const aHasColon = a.url.includes(":")
  const bHasColon = b.url.includes(":")

  if (aHasColon && !bHasColon) return 1
  if (!aHasColon && bHasColon) return -1
  return a.url.localeCompare(b.url)
})

const appRoutes = new Router()
for (let endpoint of appEndpoints) {
  endpoint.apply(appRoutes)
}

export const mainRoutes: Router[] = [
  appRoutes,
  appBackupRoutes,
  environmentVariableRoutes,
]
