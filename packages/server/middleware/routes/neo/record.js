const Router = require("@koa/router");
// const StatusCodes = require("../../utilities/statusCodes")
// const routeHandlers = require("../routeHandlers")

const controller = require("../../controllers/record");

const router = Router();

router
  .get("/api/records/:databaseId", controller.fetch)
  .post("/api/records/:databaseId", controller.save)
  .delete("/api/records/:databaseId", controller.destroy)

// router.post(
//   "/_builder/instance/:appname/:instanceid/api/record/*",
//   routeHandlers.saveRecord
// )

// router.get("/:appname/api/listRecords/*", () => {
//   ctx.body = await ctx.instance.indexApi.listItems(indexkey)
//   ctx.response.status = StatusCodes.OK
// })

// router.get(
//   "/_builder/instance/:appname/:instanceid/api/listRecords/*",
//   routeHandlers.listRecordsGet
// )

// router.post("/:appname/api/listRecords/*", routeHandlers.listRecordsPost)

// router.post(
//   "/_builder/instance/:appname/:instanceid/api/listRecords/*",
//   routeHandlers.listRecordsPost
// )

module.exports = router;