const Router = require("@koa/router")
const routeHandlers = require("../routeHandlers")

const router = new Router()

router.post("/:appname/api/authenticate", routeHandlers.authenticate)

router.post(
  "/_builder/instance/:appname/:instanceid/api/authenticate",
  routeHandlers.authenticate
)

router.post(
  "/_builder/instance/:appname/:instanceid/api/setPasswordFromTemporaryCode",
  routeHandlers.setPasswordFromTemporaryCode
)

router.post(
  "/_builder/instance/:appname/:instanceid/api/createTemporaryAccess",
  routeHandlers.createTemporaryAccess
)

router.post(
  "/:appname/api/createTemporaryAccess",
  routeHandlers.createTemporaryAccess
)

router.post(
  "/:appname/api/setPasswordFromTemporaryCode",
  routeHandlers.setPasswordFromTemporaryCode
)

module.exports = router