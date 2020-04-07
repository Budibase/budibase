const Router = require("@koa/router");
const controller = require("../../controllers/user");

const router = Router();

router
  .get("/api/:databaseId/users", controller.fetch)
  .post("/api/:databaseId/users", controller.create)
  .delete("/api/:databaseId/users/:userId", controller.destroy);

module.exports = router;