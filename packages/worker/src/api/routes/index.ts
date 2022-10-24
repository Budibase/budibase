import { api } from "@budibase/pro"
import userRoutes from "./global/users"
import configRoutes from "./global/configs"
import workspaceRoutes from "./global/workspaces"
import templateRoutes from "./global/templates"
import emailRoutes from "./global/email"
import authRoutes from "./global/auth"
import roleRoutes from "./global/roles"
import environmentRoutes from "./system/environment"
import tenantsRoutes from "./system/tenants"
import statusRoutes from "./system/status"
import selfRoutes from "./global/self"
import licenseRoutes from "./global/license"
import migrationRoutes from "./system/migrations"
import accountRoutes from "./system/accounts"

let userGroupRoutes = api.groups
export const routes = [
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
  userGroupRoutes,
  migrationRoutes,
  accountRoutes,
]
