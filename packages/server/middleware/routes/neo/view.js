const Router = require("@koa/router");
const controller = require("../../controllers/view");

const router = Router();

router
  .get("/api/:databaseId/views", controller.fetch)
  .post("/api/:databaseId/views", controller.create)
  .patch("/api/:databaseId/views", controller.update);

module.exports = router;