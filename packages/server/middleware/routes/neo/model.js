const Router = require("@koa/router");
const controller = require("../../controllers/model");

const router = Router();

router
  .get("/api/:instanceId/models", controller.fetch)
  .post("/api/:instanceId/models", controller.create)
  .patch("/api/:instanceId/models", controller.update)
  .delete("/api/:instanceId/models/:modelId", controller.delete)


module.exports = router;