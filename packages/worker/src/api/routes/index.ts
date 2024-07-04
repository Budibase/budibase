import { api as pro } from "@budibase/pro"
import Router from "@koa/router"
import authRoutes from "./global/auth"
import configRoutes from "./global/configs"
import emailRoutes from "./global/email"
import eventRoutes from "./global/events"
import licenseRoutes from "./global/license"
import roleRoutes from "./global/roles"
import selfRoutes from "./global/self"
import templateRoutes from "./global/templates"
import tenantRoutes from "./global/tenant"
import userRoutes from "./global/users"
import workspaceRoutes from "./global/workspaces"
import accountRoutes from "./system/accounts"
import environmentRoutes from "./system/environment"
import systemLogRoutes from "./system/logs"
import migrationRoutes from "./system/migrations"
import restoreRoutes from "./system/restore"
import statusRoutes from "./system/status"
import tenantsRoutes from "./system/tenants"

import env from "../../environment"

export const routes: Router[] = [
  configRoutes,
  userRoutes,
  pro.users,
  workspaceRoutes,
  authRoutes,
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
  migrationRoutes,
  accountRoutes,
  restoreRoutes,
  eventRoutes,
  tenantRoutes,
  pro.scim,
]

if (env.SELF_HOSTED) {
  routes.push(systemLogRoutes)
}
