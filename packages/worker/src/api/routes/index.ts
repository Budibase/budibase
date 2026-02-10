import Router from "@koa/router"
import { endpointGroupList } from "./endpointGroups"

// import to register the routes with the endpoint groups
import "./global/auth"
import "./global/configs"
import "./global/email"
import "./global/events"
import "./global/license"
import "./global/roles"
import "./global/self"
import "./global/templates"
import "./global/users"
import "./system/accounts"
import "./system/environment"
import "./system/logs"
import "./system/restore"
import "./system/status"
import "./system/tenants"
import auditLogsRoutes from "./global/auditLogs"
import groupRoutes from "./global/groups"
import scimRoutes from "./global/scim"

const endpointGroupsRouter = new Router()
for (let endpoint of endpointGroupList.listAllEndpoints()) {
  endpoint.apply(endpointGroupsRouter)
}

export const routes: Router[] = [
  endpointGroupsRouter,
  auditLogsRoutes,
  groupRoutes,
  scimRoutes,
]
