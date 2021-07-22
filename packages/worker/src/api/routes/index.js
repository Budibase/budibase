const userRoutes = require("./global/users")
const configRoutes = require("./global/configs")
const workspaceRoutes = require("./global/workspaces")
const templateRoutes = require("./global/templates")
const tenantsRoutes = require("./global/tenants")
const emailRoutes = require("./global/email")
const authRoutes = require("./global/auth")
const roleRoutes = require("./global/roles")
const sessionRoutes = require("./global/sessions")
const flagRoutes = require("./global/flags")
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
  flagRoutes,
]
