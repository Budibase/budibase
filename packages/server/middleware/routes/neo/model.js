const Router = require("@koa/router");
const controller = require("../../controllers/model");

const router = Router();

router
  .get("/api/:clientId/:appId/models", controller.fetch)
  .post("/api/:clientId/:appId/models", controller.save)
  .patch("/api/:clientId/:appId/models", controller.update)
  .delete("/api/:clientId/:appId/models/:modelId", controller.delete)


module.exports = router;