const Router = require("@koa/router");

const controller = require("../../controllers/database");
const router = Router();

router
  .post("/api/databases", controller.create)
  .delete("/api/databases", controller.destroy);

module.exports = router;