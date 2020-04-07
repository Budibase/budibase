const Router = require("@koa/router");
const controller = require("../../controllers/user");
const couchdb = require("../../db");

const router = Router();

function setDatabase(ctx) {
  ctx.database = couchdb.db.use(ctx.params.databaseId);
}

router
  .use(setDatabase)
  .get("/api/:databaseId/users", controller.fetch)
  .post("/api/:databaseId/users", controller.create)
  .delete("/api/:databaseId/users/:userId", controller.destroy);

module.exports = router;