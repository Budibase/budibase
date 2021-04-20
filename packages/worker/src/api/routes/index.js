const userRoutes = require("./admin/users")
const groupRoutes = require("./admin/groups")
const authRoutes = require("./auth")
const appRoutes = require("./app")

exports.routes = [userRoutes, groupRoutes, authRoutes, appRoutes]
