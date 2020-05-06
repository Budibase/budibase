const Router = require("@koa/router")
const authenticated = require("../middleware/authenticated");
const compress = require("koa-compress");
const zlib = require("zlib");
const { resolve } = require("path")
const { homedir } = require("os")
const {
  authRoutes,
  pageRoutes,
  userRoutes,
  recordRoutes,
  instanceRoutes,
  clientRoutes,
  applicationRoutes,
  modelRoutes,
  viewRoutes,
  staticRoutes,
  componentRoutes
} = require("./routes");

module.exports = app => {
  const router = new Router()

  router
    .use(compress({
      threshold: 2048,
      gzip: {
        flush: zlib.Z_SYNC_FLUSH
      },
      deflate: {
        flush: zlib.Z_SYNC_FLUSH,
      }
    }))
    .use(authenticated)
    .use(async (ctx, next) => { 
      // TODO: temp dev middleware
      // ctx.sessionId = ctx.session._sessCtx.externalKey
      // ctx.session.accessed = true
      ctx.config = { 
        latestPackagesFolder: resolve(homedir(), ".budibase"),
        secret: "foo"
      }
      await next();
    });
  
  // error handling middleware
  router.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.trace(err);
      ctx.status = err.status || err.statusCode || 500;
      ctx.body = {
        message: err.message,
        status: ctx.status
      };
    }
  });

  router.use(authRoutes.routes());
  router.use(authRoutes.allowedMethods());

  router.use(pageRoutes.routes());
  router.use(pageRoutes.allowedMethods());

  router.use(viewRoutes.routes());
  router.use(viewRoutes.allowedMethods());

  router.use(modelRoutes.routes());
  router.use(modelRoutes.allowedMethods());

  router.use(applicationRoutes.routes());
  router.use(applicationRoutes.allowedMethods());

  router.use(componentRoutes.routes());
  router.use(componentRoutes.allowedMethods());

  router.use(clientRoutes.routes());
  router.use(clientRoutes.allowedMethods());

  router.use(userRoutes.routes());
  router.use(userRoutes.allowedMethods());

  router.use(recordRoutes.routes());
  router.use(recordRoutes.allowedMethods());

  router.use(instanceRoutes.routes());
  router.use(instanceRoutes.allowedMethods());

  router.use(staticRoutes.routes());
  router.use(staticRoutes.allowedMethods());

  router.redirect("/", "/_builder");

  return router
}
