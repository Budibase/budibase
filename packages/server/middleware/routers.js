const Router = require("@koa/router")
const session = require("./session")
const StatusCodes = require("../utilities/statusCodes")
const { resolve } = require("path")
const send = require("koa-send")
const routeHandlers = require("./routeHandlers")
const {
  componentLibraryInfo,
} = require("../utilities/builder")
const {
  componentRoutes,
  appsRoutes,
  pageRoutes,
  userRoutes,
  authenticatedRoutes
} = require("./routes");

const recordRoutes = require("./routes/neo/record");
const instanceRoutes = require("./routes/neo/instance");
const neoUserRoutes = require("./routes/neo/user");
const clientRoutes = require("./routes/neo/client");
const applicationRoutes = require("./routes/neo/application");
const modelsRoutes = require("./routes/neo/model");
const viewsRoutes = require("./routes/neo/view");
const staticRoutes = require("./routes/neo/static");

const builderPath = resolve(__dirname, "../builder")

module.exports = (config, app) => {
  const router = new Router()

  router
    .use(session(app))
    .use(async (ctx, next) => { 
      // TODO: temp dev middleware
      // ctx.sessionId = ctx.session._sessCtx.externalKey
      // ctx.session.accessed = true
      ctx.config = config;
      ctx.isAuthenticated = true;
      await next();
    });
    // .use(async (ctx, next) => {
      // ctx.sessionId = ctx.session._sessCtx.externalKey
      // ctx.session.accessed = true
      // ctx.config = config

    //   const pathParts = ctx.path.split("/")

    //   if (pathParts.length < 2) {
    //     ctx.throw(StatusCodes.NOT_FOUND, "App Name not declared")
    //   }

    //   const appname = pathParts[1]
    //   ctx.set("x-bbappname", appname)

    //   if (appname === "_builder") {
    //     if (!config.dev) {
    //       ctx.response.status = StatusCodes.FORBIDDEN
    //       ctx.body = "run in dev mode to access builder"
    //       return
    //     }

    //     // Builder URLs should have admin access to the API 
    //     if (ctx.path.startsWith("/_builder/instance/_master")) {
    //       const {
    //         instance,
    //         publicPath,
    //         sharedPath,
    //       } = await ctx.master.getFullAccessApiForMaster()
    //       ctx.instance = instance
    //       ctx.publicPath = publicPath
    //       ctx.sharedPath = sharedPath
    //       ctx.isAuthenticated = !!ctx.instance
    //     } else if (ctx.path.startsWith("/_builder/instance")) {
    //       const builderAppName = pathParts[3]
    //       const instanceId = pathParts[4]
    //       const {
    //         bbInstance,
    //         publicPath,
    //         sharedPath,
    //       } = await ctx.master.getFullAccessApiForInstanceId(
    //         builderAppName,
    //         instanceId
    //       )
    //       ctx.instance = bbInstance
    //       ctx.publicPath = publicPath
    //       ctx.sharedPath = sharedPath
    //       ctx.isAuthenticated = !!ctx.instance
    //     }

    //     await next()
    //   } else {
    //     const instance = await ctx.master.getInstanceApiForSession(
    //       appname,
    //       ctx.sessionId
    //     )

    //     ctx.instance = instance.instance
    //     ctx.publicPath = instance.publicPath
    //     ctx.sharedPath = instance.sharedPath
    //     ctx.isAuthenticated = !!instance.instance

    //     await next()
    //   }
    // })

    router
      // .get("/_builder", async ctx => {
      //   await send(ctx, "/index.html", { root: builderPath })
      // })
      .get("/_builder/:appname/componentlibrary", async ctx => {
        const info = await componentLibraryInfo(
          ctx.config,
          ctx.params.appname,
          ctx.query.lib
        )
        await send(ctx, info.components._lib || "index.js", { root: info.libDir })
      })
      // .get("/_builder/*", async (ctx, next) => {
      //   const path = ctx.path.replace("/_builder", "")

      //   const isFile = new RegExp(/(.+\..{1,5})/g).test(path)

      //   if (path.startsWith("/api/") || path.startsWith("/instance/")) {
      //     await next()
      //   } else if (isFile) {
      //     await send(ctx, path, { root: builderPath })
      //   } else {
      //     await send(ctx, "/index.html", { root: builderPath })
      //   }
      // })
  
  // Neo
  // error handling middleware
  router.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.trace(err);
      ctx.status = err.status || 500;
      ctx.body = {
        message: err.message,
        status: ctx.status
      };
    }
  });

  // Legacy Routes
  router.use(userRoutes.routes());
  router.use(userRoutes.allowedMethods());
  router.use(appsRoutes.routes())
  router.use(appsRoutes.allowedMethods());
  router.use(componentRoutes.routes());
  router.use(componentRoutes.allowedMethods());
  router.use(pageRoutes.routes());
  router.use(pageRoutes.allowedMethods());

  // Neo Routes
  router.use(staticRoutes.routes());
  router.use(staticRoutes.allowedMethods());

  router.use(viewsRoutes.routes());
  router.use(viewsRoutes.allowedMethods());

  router.use(modelsRoutes.routes());
  router.use(modelsRoutes.allowedMethods());

  router.use(applicationRoutes.routes());
  router.use(applicationRoutes.allowedMethods());

  router.use(clientRoutes.routes());
  router.use(clientRoutes.allowedMethods());

  router.use(neoUserRoutes.routes());
  router.use(neoUserRoutes.allowedMethods());

  router.use(recordRoutes.routes());
  router.use(recordRoutes.allowedMethods());

  router.use(instanceRoutes.routes());
  router.use(instanceRoutes.allowedMethods());
  // end of Neo

  // router
    // .get("/:appname", async ctx => {
    //   await send(ctx, "/index.html", { root: ctx.publicPath })
    // }) 
  //   .get("/:appname/*", routeHandlers.appDefault)
  //   .get("/_builder/instance/:appname/:instanceid/*", routeHandlers.appDefault)


  router.use(authenticatedRoutes.routes());
  router.use(authenticatedRoutes.allowedMethods());

  return router
}
