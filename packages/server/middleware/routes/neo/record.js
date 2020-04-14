const Router = require("@koa/router");
const controller = require("../../controllers/record");

const router = Router();

router
  .get("/api/:databaseId/:modelId/records", controller.fetch)
  .get("/api/:databaseId/records/:recordId", controller.find)
  .post("/api/:databaseId/records", controller.save)
  .delete("/api/:databaseId/records/:recordId", controller.destroy)

module.exports = router;