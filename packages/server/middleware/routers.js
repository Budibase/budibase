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

const builderPath = resolve(__dirname, "../builder")

module.exports = (config, app) => {
  const router = new Router()

  router
    .use(session(config, app))
    .use(async (ctx, next) => {
      ctx.sessionId = ctx.session._sessCtx.externalKey
      ctx.session.accessed = true
      ctx.config = config

      const pathParts = ctx.path.split("/")

      if (pathParts.length < 2) {
        ctx.throw(StatusCodes.NOT_FOUND, "App Name not declared")
      }

      const appname = pathParts[1]
      ctx.set("x-bbappname", appname)

      if (appname === "_builder") {
        if (!config.dev) {
          ctx.response.status = StatusCodes.FORBIDDEN
          ctx.body = "run in dev mode to access builder"
          return
        }

        // Builder URLs should have admin access to the API 
        if (ctx.path.startsWith("/_builder/instance/_master")) {
          const {
            instance,
            publicPath,
            sharedPath,
          } = await ctx.master.getFullAccessApiForMaster()
          ctx.instance = instance
          ctx.publicPath = publicPath
          ctx.sharedPath = sharedPath
          ctx.isAuthenticated = !!ctx.instance
        } else if (ctx.path.startsWith("/_builder/instance")) {
          const builderAppName = pathParts[3]
          const instanceId = pathParts[4]
          const {
            bbInstance,
            publicPath,
            sharedPath,
          } = await ctx.master.getFullAccessApiForInstanceId(
            builderAppName,
            instanceId
          )
          ctx.instance = bbInstance
          ctx.publicPath = publicPath
          ctx.sharedPath = sharedPath
          ctx.isAuthenticated = !!ctx.instance
        }

        await next()
      } else {
        const instance = await ctx.master.getInstanceApiForSession(
          appname,
          ctx.sessionId
        )

        ctx.instance = instance.instance
        ctx.publicPath = instance.publicPath
        ctx.sharedPath = instance.sharedPath
        ctx.isAuthenticated = !!instance.instance

        await next()
      }
    })

    router
      .get("/_builder", async ctx => {
        await send(ctx, "/index.html", { root: builderPath })
      })
      .get("/_builder/:appname/componentlibrary", async ctx => {
        const info = await componentLibraryInfo(
          ctx.config,
          ctx.params.appname,
          ctx.query.lib
        )
        await send(ctx, info.components._lib || "index.js", { root: info.libDir })
      })
      .get("/_builder/*", async (ctx, next) => {
        const path = ctx.path.replace("/_builder", "")

        const isFile = new RegExp(/(.+\..{1,5})/g).test(path)

        if (path.startsWith("/api/") || path.startsWith("/instance/")) {
          await next()
        } else if (isFile) {
          await send(ctx, path, { root: builderPath })
        } else {
          await send(ctx, "/index.html", { root: builderPath })
        }
      })

  router.use(userRoutes.routes());
  router.use(userRoutes.allowedMethods());
  router.use(appsRoutes.routes())
  router.use(appsRoutes.allowedMethods());
  router.use(componentRoutes.routes());
  router.use(componentRoutes.allowedMethods());
  router.use(pageRoutes.routes());
  router.use(pageRoutes.allowedMethods());

  router
    .get("/:appname", async ctx => {
      await send(ctx, "/index.html", { root: ctx.publicPath })
    }) 
    .get("/:appname/*", routeHandlers.appDefault)
    .get("/_builder/instance/:appname/:instanceid/*", routeHandlers.appDefault)

  router.use(authenticatedRoutes.routes());
  router.use(authenticatedRoutes.allowedMethods());

  return router
}
