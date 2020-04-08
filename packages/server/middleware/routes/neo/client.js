const Router = require("@koa/router");
const controller = require("../../controllers/client");

const router = Router();

router
  .post("/api/clients", controller.create)
  .delete("/api/clients/:clientId", controller.destroy);

module.exports = router;