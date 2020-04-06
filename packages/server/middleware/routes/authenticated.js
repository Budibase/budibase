const Router = require("@koa/router");
const StatusCodes = require("../../utilities/statusCodes")
const routeHandlers = require("../routeHandlers")

const router = Router();

async function isAuthenticated(ctx, next) {
  if (ctx.isAuthenticated) {
    await next()
  } else {
    ctx.response.status = StatusCodes.UNAUTHORIZED
  }
}

router.use(isAuthenticated)

router.post(
  "/_builder/instance/:appname/:instanceid/api/upgradeData",
  routeHandlers.upgradeData
)

router.post("/:appname/api/changeMyPassword", routeHandlers.changeMyPassword)

router.post(
  "/_builder/instance/:appname/:instanceid/api/changeMyPassword",
  routeHandlers.changeMyPassword
)

router.post(
  "/:appname/api/executeAction/:actionname",
  routeHandlers.executeAction
)

router.post(
  "/_builder/instance/:appname/:instanceid/api/executeAction/:actionname",
  routeHandlers.executeAction
)

router.post("/:appname/api/createUser", routeHandlers.createUser)

router.post(
  "/_builder/instance/:appname/:instanceid/api/createUser",
  routeHandlers.createUser
)

router.post("/:appname/api/enableUser", routeHandlers.enableUser)

router.post(
  "/_builder/instance/:appname/:instanceid/api/enableUser",
  routeHandlers.enableUser
)

router.post("/:appname/api/disableUser", routeHandlers.disableUser)

router.post(
  "/_builder/instance/:appname/:instanceid/api/disableUser",
  routeHandlers.disableUser
)

router.get("/:appname/api/users", routeHandlers.getUsers)

router.get(
  "/_builder/instance/:appname/:instanceid/api/users",
  routeHandlers.getUsers
)

router.get("/:appname/api/accessLevels", routeHandlers.getAccessLevels)

router.get(
  "/_builder/instance/:appname/:instanceid/api/accessLevels",
  routeHandlers.getAccessLevels
)

router.get("/:appname/api/listRecords/*", routeHandlers.listRecordsGet)

router.get(
  "/_builder/instance/:appname/:instanceid/api/listRecords/*",
  routeHandlers.listRecordsGet
)

router.post("/:appname/api/listRecords/*", routeHandlers.listRecordsPost)

router.post(
  "/_builder/instance/:appname/:instanceid/api/listRecords/*",
  routeHandlers.listRecordsPost
)

router.post("/:appname/api/aggregates/*", routeHandlers.aggregatesPost)

router.post(
  "/_builder/instance/:appname/:instanceid/api/aggregates/*",
  routeHandlers.aggregatesPost
)

router.post("/:appname/api/files/*", routeHandlers.postFiles)

router.post(
  "/_builder/instance/:appname/:instanceid/api/files/*",
  routeHandlers.postFiles
)

router.post("/:appname/api/record/*", routeHandlers.saveRecord)

router.post(
  "/_builder/instance/:appname/:instanceid/api/record/*",
  routeHandlers.saveRecord
)

router.get("/:appname/api/lookup_field/*", routeHandlers.lookupField)

router.get(
  "/_builder/instance/:appname/:instanceid/api/lookup_field/*",
  routeHandlers.lookupField
)

router.get("/:appname/api/record/*", routeHandlers.getRecord)

router.get(
  "/_builder/instance/:appname/:instanceid/api/record/*",
  routeHandlers.getRecord
)

router.del("/:appname/api/record/*", routeHandlers.deleteRecord)

router.del(
  "/_builder/instance/:appname/:instanceid/api/record/*",
  routeHandlers.deleteRecord
)

router.post("/:appname/api/apphierarchy", routeHandlers.saveAppHierarchy)

module.exports = router