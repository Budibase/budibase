const deployRoutes = require("./deploy")
const appRoutes = require("./app")

exports.routes = [deployRoutes, appRoutes]
