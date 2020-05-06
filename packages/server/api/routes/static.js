const Router = require("@koa/router");
const controller = require("../controllers/static");

const router = Router();

router
  .param("file", async (file, ctx, next) => {
    ctx.file = file && file.includes(".") ? file : "index.html";

    // Serving the client library from your local dir in dev
    if (ctx.isDev && ctx.file.startsWith("budibase-client")) {
      ctx.devPath = "/tmp/.budibase";
    }

    await next();
  })
  .get("/_builder/:file*", controller.serveBuilder)
  .get("/:appId/componentlibrary", controller.serveComponentLibrary)
  .get("/:appId/:file*", controller.serveApp);

module.exports = router;