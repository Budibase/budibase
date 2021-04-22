const userRoutes = require("./admin/users")
const configRoutes = require("./admin/configs")
const groupRoutes = require("./admin/groups")
const authRoutes = require("./auth")
const appRoutes = require("./app")

exports.routes = [configRoutes, userRoutes, groupRoutes, authRoutes, appRoutes]
