const Router = require("@koa/router");
const controller = require("../../controllers/record");

const router = Router();

router
  .get("/api/:databaseId/records/:modelname", controller.fetch)
  .post("/api/:databaseId/record", controller.save)
  .get("/api/:databaseId/record/:recordId", controller.find)
  .delete("/api/:databaseId/record/:recordId", controller.destroy)

module.exports = router;