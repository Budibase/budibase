const userRoutes = require("./admin/users")
const configRoutes = require("./admin/configs")
const groupRoutes = require("./admin/groups")
const templateRoutes = require("./admin/templates")
const emailRoutes = require("./admin/email")
const authRoutes = require("./admin/auth")
const appRoutes = require("./app")

exports.routes = [
  configRoutes,
  userRoutes,
  groupRoutes,
  authRoutes,
  appRoutes,
  templateRoutes,
  emailRoutes,
]
