// const Router = require("@koa/router")
// const queryController = require("../controllers/query")
// const authorized = require("../../middleware/authorized")
// const { BUILDER } = require("../../utilities/security/permissions")

// const router = Router()

// // TODO: send down the datasource ID as well

// router
//   // .get("/api/queries", authorized(BUILDER), queryController.fetch)
//   // .get(
//   //   "/api/datasources/:datasourceId/queries/:id",
//   //   authorized(PermissionTypes.TABLE, PermissionLevels.READ),
//   //   queryController.find
//   // )
//   .post(
//     "/api/datasources/:datasourceId/queries",
//     authorized(BUILDER),
//     queryController.save
//   )
//   .delete(
//     "/api/datasources/:datasourceId/queries/:queryId/:revId",
//     authorized(BUILDER),
//     queryController.destroy
//   )

// module.exports = router
