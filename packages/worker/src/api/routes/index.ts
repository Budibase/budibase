import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import { endpointGroupList } from "./endpointGroups"

// import to register the routes with the endpoint groups
import "./global/auth"
import "./global/users"
import "./global/configs"
import "./global/templates"
import "./global/email"
import "./global/roles"
import "./global/events"
import "./system/environment"
import "./system/tenants"
import "./system/status"
import "./global/self"
import "./global/license"
import "./system/accounts"
import "./system/restore"
import "./system/logs"

const endpointGroupsRouter = new Router()
for (let endpoint of endpointGroupList.listAllEndpoints()) {
  endpoint.apply(endpointGroupsRouter)
}

export const routes: Router[] = [
  endpointGroupsRouter,
  pro.users,
  pro.groups,
  pro.auditLogs,
  pro.scim,
]
