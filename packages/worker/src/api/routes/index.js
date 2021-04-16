const adminRoutes = require("./admin")
const authRoutes = require("./auth")
const appRoutes = require("./app")

exports.routes = [adminRoutes, authRoutes, appRoutes]
