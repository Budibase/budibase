const Router = require("@koa/router")
const queryController = require("../controllers/query")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

// TODO: sort out auth so apps have the right permissions
router
  .get("/api/queries", authorized(BUILDER), queryController.fetch)
  .post("/api/queries", authorized(BUILDER), queryController.save)
  .post("/api/queries/preview", authorized(BUILDER), queryController.preview)
  .post("/api/queries/:queryId", authorized(BUILDER), queryController.execute)
  .delete("/api/queries/:queryId", authorized(BUILDER), queryController.destroy)

module.exports = router
