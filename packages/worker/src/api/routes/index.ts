import Router from "@koa/router"
import { api as pro } from "@budibase/pro"
import userRoutes from "./global/users"
import configRoutes from "./global/configs"
import workspaceRoutes from "./global/workspaces"
import templateRoutes from "./global/templates"
import emailRoutes from "./global/email"
import authRoutes from "./global/auth"
import roleRoutes from "./global/roles"
import eventRoutes from "./global/events"
import environmentRoutes from "./system/environment"
import tenantsRoutes from "./system/tenants"
import statusRoutes from "./system/status"
import selfRoutes from "./global/self"
import licenseRoutes from "./global/license"
import migrationRoutes from "./system/migrations"
import accountRoutes from "./system/accounts"
import restoreRoutes from "./system/restore"

export const routes: Router[] = [
  configRoutes,
  userRoutes,
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
  pro.scim,
]
