const appRoute = require("./applications")
const queryRoute = require("./queries")
const tableRoute = require("./tables")
const rowRoute = require("./rows")
const userRoute = require("./users")
const Router = require("@koa/router")

const PREFIX = "/api/public/v1"
const ROUTES = [
  appRoute,
  queryRoute,
  tableRoute,
  rowRoute,
  userRoute
]

const router = new Router({
  prefix: PREFIX,
})
for (let route of ROUTES) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

module.exports = router
