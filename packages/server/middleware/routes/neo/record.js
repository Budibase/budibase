const Router = require("@koa/router");
const controller = require("../../controllers/record");

const router = Router();

router
  .get("/api/:databaseId/records", controller.fetch)
  .post("/api/:databaseId/records", controller.save)
  .delete("/api/:databaseId/records/:recordId", controller.destroy)

module.exports = router;