const Router = require("@koa/router");
const controller = require("../../controllers/client");

const router = Router();

router
  .get("/api/client/id", controller.getClientId)
  .post("/api/clients", controller.create)
  .delete("/api/clients/:clientId", controller.destroy);

module.exports = router;