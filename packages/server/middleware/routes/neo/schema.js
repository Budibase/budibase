const Router = require("@koa/router");
const controller = require("../../controllers/schema");

const router = Router();

router
  .get("/api/:clientId/:appId/schemas", controller.fetch)
  .post("/api/:clientId/:appId/schemas", controller.save)
  .patch("/api/:clientId/:appId/schemas/apply", controller.apply)
  .delete("/api/:clientId/:appId/schemas/:schemaId", controller.delete)


module.exports = router;