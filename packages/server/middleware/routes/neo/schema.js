const Router = require("@koa/router");
const controller = require("../../controllers/schema");

const router = Router();

router
  .get("/api/schemas/:appId", controller.fetch)
  .post("/api/schemas/:appId", controller.save)
  .delete("/api/schemas/:appId", controller.delete)