const userRoutes = require("./admin/users")
const configRoutes = require("./admin/configs")
const workspaceRoutes = require("./admin/workspaces")
const templateRoutes = require("./admin/templates")
const tenantsRoutes = require("./admin/tenants")
const emailRoutes = require("./admin/email")
const authRoutes = require("./admin/auth")
const roleRoutes = require("./admin/roles")
const sessionRoutes = require("./admin/sessions")
const appRoutes = require("./app")

exports.routes = [
  configRoutes,
  userRoutes,
  workspaceRoutes,
  authRoutes,
  appRoutes,
  templateRoutes,
  tenantsRoutes,
  emailRoutes,
  sessionRoutes,
  roleRoutes,
]
