import { api as pro } from "@budibase/pro"
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

const endpointGroupsRouter = new Router()
for (let endpoint of endpointGroupList.listAllEndpoints()) {
  endpoint.apply(endpointGroupsRouter)
}

export const routes: Router[] = [
  endpointGroupsRouter,
  pro.groups,
  pro.auditLogs,
  pro.scim,
]
