const Router = require("@koa/router");
const controller = require("../controllers/screen");

const router = Router();

router
  .get("/api/:instanceId/screens", controller.fetch)
  .post("/api/:instanceId/screens", controller.save)
  .delete("/api/:instanceId/:screenId/:revId", controller.destroy);


module.exports = router;