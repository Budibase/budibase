const Router = require("@koa/router")
const controller = require("../controllers/deploy")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

router
  .get("/api/deployments", authorized(BUILDER), controller.fetchDeployments)
  .get(
    "/api/deploy/:deploymentId",
    authorized(BUILDER),
    controller.deploymentProgress
  )
  .post("/api/deploy", authorized(BUILDER), controller.deployApp)

module.exports = router
