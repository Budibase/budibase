const Router = require("@koa/router");
const controller = require("../../controllers/static");

const router = Router();

router
  .param("file", async (file, ctx, next) => {
    ctx.file = file && file.includes(".") ? file : "index.html";
    await next();
  })
  .get("/_builder/:file*", controller.serveBuilder)
  .get("/:appName", controller.serveApp);

module.exports = router;