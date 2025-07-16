import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import { allRoutes } from "./endpointGroups"
import configRoutes from "./global/configs"
import templateRoutes from "./global/templates"
import emailRoutes from "./global/email"
import roleRoutes from "./global/roles"
import eventRoutes from "./global/events"
import environmentRoutes from "./system/environment"
import tenantsRoutes from "./system/tenants"
import statusRoutes from "./system/status"
import selfRoutes from "./global/self"
import licenseRoutes from "./global/license"
import accountRoutes from "./system/accounts"
import restoreRoutes from "./system/restore"
import systemLogRoutes from "./system/logs"

// import routes to register with endpointGroups
import "./global/auth"
import "./global/users"

import env from "../../environment"

const endpointGroups = allRoutes()
const endpointGroupsEndpoints = endpointGroups.flatMap(group => group.endpointList())

const endpointGroupsRouter = new Router()
for (let endpoint of endpointGroupsEndpoints) {
  endpoint.apply(endpointGroupsRouter)
}

export const routes: Router[] = [
  endpointGroupsRouter,
  configRoutes,
  pro.users,
  templateRoutes,
  tenantsRoutes,
  emailRoutes,
  roleRoutes,
  environmentRoutes,
  statusRoutes,
  selfRoutes,
  licenseRoutes,
  pro.groups,
  pro.auditLogs,
  accountRoutes,
  restoreRoutes,
  eventRoutes,
  pro.scim,
]

if (env.SELF_HOSTED) {
  routes.push(systemLogRoutes)
}
