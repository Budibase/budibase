const { userRoutes, groupRoutes } = require("./admin")
const authRoutes = require("./auth")
const appRoutes = require("./app")

exports.routes = [userRoutes, groupRoutes, authRoutes, appRoutes]
