const Router = require("@koa/router")
const controller = require("../controllers/client")
const env = require("../../environment")

const router = Router()

router.get("/api/client/id", controller.getClientId)

if (env.NODE_ENV === "jest") {
  router
    .post("/api/client", controller.create)
    .delete("/api/client", controller.destroy)
}

module.exports = router
