const Router = require("@koa/router");
const controller = require("../../controllers/page");

const router = Router();

router
  .get("/api/:instanceId/pages", controller.fetch)
  .post("/api/:instanceId/pages", controller.save)
  .delete("/api/:instanceId/:pageId/:revId", controller.destroy);


module.exports = router;