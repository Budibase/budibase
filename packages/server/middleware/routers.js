const Router = require("@koa/router")
const session = require("./session")
const StatusCodes = require("../utilities/statusCodes")
const { resolve } = require("path")
const send = require("koa-send")
const routeHandlers = require("./routeHandlers")

const {
  getPackageForBuilder,
  getComponentDefinitions,
  getApps,
  saveScreen,
  renameScreen,
  deleteScreen,
  buildPage,
  componentLibraryInfo,
  listScreens,
  saveBackend,
} = require("../utilities/builder")

const builderPath = resolve(__dirname, "../builder")

module.exports = (config, app) => {
  const router = new Router()

  router
    .use(session(config, app))
    .use(async (ctx, next) => {
      ctx.sessionId = ctx.session._sessCtx.externalKey
      ctx.session.accessed = true

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
    .get("/_builder", async ctx => {
      await send(ctx, "/index.html", { root: builderPath })
    })
    .get("/_builder/:appname/componentlibrary", async ctx => {
      const info = await componentLibraryInfo(
        config,
        ctx.params.appname,
        ctx.query.lib
      )
      await send(ctx, info.components._lib || "index.js", { root: info.libDir })
    })
    .get("/_builder/*", async (ctx, next) => {
      const path = ctx.path.replace("/_builder", "")

      if (path.startsWith("/api/") || path.startsWith("/instance/")) {
        await next()
      } else {
        await send(ctx, path, { root: builderPath })
      }
    })
    .post("/:appname/api/authenticate", routeHandlers.authenticate)
    .post(
      "/_builder/instance/:appname/:instanceid/api/authenticate",
      routeHandlers.authenticate
    )
    .post(
      "/:appname/api/setPasswordFromTemporaryCode",
      routeHandlers.setPasswordFromTemporaryCode
    )
    .post(
      "/_builder/instance/:appname/:instanceid/api/setPasswordFromTemporaryCode",
      routeHandlers.setPasswordFromTemporaryCode
    )
    .post(
      "/:appname/api/createTemporaryAccess",
      routeHandlers.createTemporaryAccess
    )
    .post(
      "/_builder/instance/:appname/:instanceid/api/createTemporaryAccess",
      routeHandlers.createTemporaryAccess
    )
    .get("/_builder/api/apps", async ctx => {
      ctx.body = await getApps(config, ctx.master)
      ctx.response.status = StatusCodes.OK
    })
    .get("/_builder/api/:appname/appPackage", async ctx => {
      const application = await ctx.master.getApplicationWithInstances(
        ctx.params.appname
      )
      ctx.body = await getPackageForBuilder(config, application)
      ctx.response.status = StatusCodes.OK
    })
    .get("/_builder/api/:appname/components", async ctx => {
      try {
        ctx.body = getComponentDefinitions(
          config,
          ctx.params.appname,
          ctx.query.lib
        )
        ctx.response.status = StatusCodes.OK
      } catch (e) {
        if (e.status) {
          ctx.response.status = e.status
        } else {
          throw e
        }
      }
    })

    .get("/_builder/api/:appname/componentlibrary", async ctx => {
      const info = await componentLibraryInfo(
        config,
        ctx.params.appname,
        ctx.query.lib ? decodeURI(ctx.query.lib) : ""
      )
      ctx.body = info.components
      ctx.response.status = StatusCodes.OK
    })
    .post("/_builder/api/:appname/backend", async ctx => {
      await saveBackend(
        config,
        ctx.params.appname,
        ctx.request.body.appDefinition,
        ctx.request.body.accessLevels
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/_builder/api/:appname/pages/:pageName", async ctx => {
      await buildPage(
        config,
        ctx.params.appname,
        ctx.params.pageName,
        ctx.request.body
      )
      ctx.response.status = StatusCodes.OK
    })
    .get("/_builder/api/:appname/pages/:pagename/screens", async ctx => {
      ctx.body = await listScreens(
        config,
        ctx.params.appname,
        ctx.params.pagename
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/_builder/api/:appname/pages/:pagename/screen", async ctx => {
      ctx.body = await saveScreen(
        config,
        ctx.params.appname,
        ctx.params.pagename,
        ctx.request.body
      )
      ctx.response.status = StatusCodes.OK
    })
    .patch("/_builder/api/:appname/pages/:pagename/screen", async ctx => {
      await renameScreen(
        config,
        ctx.params.appname,
        ctx.params.pagename,
        ctx.request.body.oldname,
        ctx.request.body.newname
      )
      ctx.response.status = StatusCodes.OK
    })
    .delete("/_builder/api/:appname/pages/:pagename/screen/*", async ctx => {
      const name = ctx.request.path.replace(
        `/_builder/api/${ctx.params.appname}/pages/${ctx.params.pagename}/screen/`,
        ""
      )

      await deleteScreen(
        config,
        ctx.params.appname,
        ctx.params.pagename,
        decodeURI(name)
      )

      ctx.response.status = StatusCodes.OK
    })
    .get("/:appname", async ctx => {
      await send(ctx, "/index.html", { root: ctx.publicPath })
    })
    .get("/:appname/*", routeHandlers.appDefault)
    .get("/_builder/instance/:appname/:instanceid/*", routeHandlers.appDefault)
    // EVERYTHING BELOW HERE REQUIRES AUTHENTICATION
    .use(async (ctx, next) => {
      if (ctx.isAuthenticated) {
        await next()
      } else {
        ctx.response.status = StatusCodes.UNAUTHORIZED
      }
      next()
    })
    .post("/:appname/api/changeMyPassword", routeHandlers.changeMyPassword)
    .post(
      "/_builder/instance/:appname/:instanceid/api/changeMyPassword",
      routeHandlers.changeMyPassword
    )
    .post(
      "/:appname/api/executeAction/:actionname",
      routeHandlers.executeAction
    )
    .post(
      "/_builder/instance/:appname/:instanceid/api/executeAction/:actionname",
      routeHandlers.executeAction
    )
    .post("/:appname/api/createUser", routeHandlers.createUser)
    .post(
      "/_builder/instance/:appname/:instanceid/api/createUser",
      routeHandlers.createUser
    )
    .post("/:appname/api/enableUser", routeHandlers.enableUser)
    .post(
      "/_builder/instance/:appname/:instanceid/api/enableUser",
      routeHandlers.enableUser
    )
    .post("/:appname/api/disableUser", routeHandlers.disableUser)
    .post(
      "/_builder/instance/:appname/:instanceid/api/disableUser",
      routeHandlers.disableUser
    )
    .get("/:appname/api/users", routeHandlers.getUsers)
    .get(
      "/_builder/instance/:appname/:instanceid/api/users",
      routeHandlers.getUsers
    )
    .get("/:appname/api/accessLevels", routeHandlers.getAccessLevels)
    .get(
      "/_builder/instance/:appname/:instanceid/api/accessLevels",
      routeHandlers.getAccessLevels
    )
    .get("/:appname/api/listRecords/*", routeHandlers.listRecordsGet)
    .get(
      "/_builder/instance/:appname/:instanceid/api/listRecords/*",
      routeHandlers.listRecordsGet
    )
    .post("/:appname/api/listRecords/*", routeHandlers.listRecordsPost)
    .post(
      "/_builder/instance/:appname/:instanceid/api/listRecords/*",
      routeHandlers.listRecordsPost
    )
    .post("/:appname/api/aggregates/*", routeHandlers.aggregatesPost)
    .post(
      "/_builder/instance/:appname/:instanceid/api/aggregates/*",
      routeHandlers.aggregatesPost
    )
    .post("/:appname/api/files/*", routeHandlers.postFiles)
    .post(
      "/_builder/instance/:appname/:instanceid/api/files/*",
      routeHandlers.postFiles
    )
    .post("/:appname/api/record/*", routeHandlers.saveRecord)
    .post(
      "/_builder/instance/:appname/:instanceid/api/record/*",
      routeHandlers.saveRecord
    )
    .get("/:appname/api/lookup_field/*", routeHandlers.lookupField)
    .get(
      "/_builder/instance/:appname/:instanceid/api/lookup_field/*",
      routeHandlers.lookupField
    )
    .get("/:appname/api/record/*", routeHandlers.getRecord)
    .get(
      "/_builder/instance/:appname/:instanceid/api/record/*",
      routeHandlers.getRecord
    )
    .del("/:appname/api/record/*", routeHandlers.deleteRecord)
    .del(
      "/_builder/instance/:appname/:instanceid/api/record/*",
      routeHandlers.deleteRecord
    )
    .post("/:appname/api/apphierarchy", routeHandlers.saveAppHierarchy)

  return router
}