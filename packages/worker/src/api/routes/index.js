const { api } = require("@budibase/pro")
const userRoutes = require("./global/users")
const configRoutes = require("./global/configs")
const workspaceRoutes = require("./global/workspaces")
const templateRoutes = require("./global/templates")
const emailRoutes = require("./global/email")
const authRoutes = require("./global/auth")
const roleRoutes = require("./global/roles")
const sessionRoutes = require("./global/sessions")
const environmentRoutes = require("./system/environment")
const tenantsRoutes = require("./system/tenants")
const statusRoutes = require("./system/status")
const selfRoutes = require("./global/self")
const licenseRoutes = require("./global/license")

let userGroupRoutes = api.groups
exports.routes = [
  configRoutes,
  userRoutes,
  workspaceRoutes,
  authRoutes,
  templateRoutes,
  tenantsRoutes,
  emailRoutes,
  sessionRoutes,
  roleRoutes,
  environmentRoutes,
  statusRoutes,
  selfRoutes,
  licenseRoutes,
  userGroupRoutes,
]
