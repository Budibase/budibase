const Router = require("@koa/router");
const controller = require("../../controllers/view");

const router = Router();

router
  .get("/api/:instanceId/views", controller.fetch)
  // .patch("/api/:databaseId/views", controller.update);
  // .delete("/api/:instanceId/views/:viewId/:revId", controller.destroy);
  .post("/api/:instanceId/views", controller.create);

module.exports = router;