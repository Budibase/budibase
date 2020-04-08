const Router = require("@koa/router");
const controller = require("../../controllers/database");

const router = Router();

router
  .get("/api/databases", controller.fetch)
  .post("/api/databases", controller.create)
  .delete("/api/databases/:databaseId", controller.destroy);

module.exports = router;