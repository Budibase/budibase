const Router = require("@koa/router")
const session = require("./session")
const StatusCodes = require("../utilities/statusCodes")
const fs = require("fs")
const { resolve } = require("path")
const send = require("koa-send")
const {
  getPackageForBuilder,
  getComponents,
  getApps,
  saveScreen,
  renameScreen,
  deleteScreen,
  savePagePackage,
  componentLibraryInfo,
  listScreens,
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
      if (!config.dev) {
        ctx.response.status = StatusCodes.FORBIDDEN
        ctx.body = "run in dev mode to access builder"
        return
      }

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
    .get("/_builder/:appname/componentLibraryGenerators", async ctx => {
      const info = await componentLibraryInfo(
        config,
        ctx.params.appname,
        ctx.query.lib
      )
      await send(ctx, info.generators._lib || "generators.js", {
        root: info.libDir,
      })
    })
    .get("/_builder/*", async (ctx, next) => {
      if (!config.dev) {
        ctx.response.status = StatusCodes.FORBIDDEN
        ctx.body = "run in dev mode to access builder"
        return
      }

      const path = ctx.path.replace("/_builder", "")

      if (path.startsWith("/api/")) {
        await next()
      } else {
        await send(ctx, path, { root: builderPath })
      }
    })
    .post("/:appname/api/authenticate", async (ctx, next) => {
      const user = await ctx.master.authenticate(
        ctx.sessionId,
        ctx.params.appname,
        ctx.request.body.username,
        ctx.request.body.password
      )
      if (!user) {
        ctx.throw(StatusCodes.UNAUTHORIZED, "invalid username or password")
      }
      ctx.body = user.user_json
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/setPasswordFromTemporaryCode", async ctx => {
      const instanceApi = await ctx.master.getFullAccessInstanceApiForUsername(
        ctx.params.appname,
        ctx.request.body.username
      )

      if (!instanceApi) {
        ctx.request.status = StatusCodes.OK
        return
      }

      await instanceApi.authApi.setPasswordFromTemporaryCode(
        ctx.request.body.tempCode,
        ctx.request.body.newPassword
      )

      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/createTemporaryAccess", async ctx => {
      const instanceApi = await ctx.master.getFullAccessInstanceApiForUsername(
        ctx.params.appname,
        ctx.request.body.username
      )

      if (!instanceApi) {
        ctx.request.status = StatusCodes.OK
        return
      }

      await instanceApi.authApi.createTemporaryAccess(ctx.request.body.username)

      ctx.response.status = StatusCodes.OK
    })
    .get("/_builder/api/apps", async ctx => {
      ctx.body = await getApps(config, ctx.master)
      ctx.response.status = StatusCodes.OK
    })
    .get("/_builder/api/:appname/appPackage", async ctx => {
      ctx.body = await getPackageForBuilder(config, ctx.params.appname)
      ctx.response.status = StatusCodes.OK
    })
    .get("/_builder/api/:appname/components", async ctx => {
      try {
        ctx.body = getComponents(config, ctx.params.appname, ctx.query.lib)
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
    .get("/_builder/api/:appname/generators", async ctx => {
      const info = await componentLibraryInfo(
        config,
        ctx.params.appname,
        ctx.query.lib ? decodeURI(ctx.query.lib) : ""
      )
      ctx.body = info.generators
      ctx.response.status = StatusCodes.OK
    })
    .post("/_builder/api/:appname/pages/:pageName", async ctx => {
      await savePagePackage(
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
      await saveScreen(
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
    .get("/:appname/*", async (ctx, next) => {
      const path = ctx.path.replace(`/${ctx.params.appname}`, "")

      if (path.startsWith("/api/")) {
        await next()
      } else if (path.startsWith("/_shared/")) {
        await send(ctx, path.replace(`/_shared/`, ""), { root: ctx.sharedPath })
      } else {
        await send(ctx, path, { root: ctx.publicPath })
      }
    })
    .use(async (ctx, next) => {
      if (ctx.isAuthenticated) {
        await next()
      } else {
        ctx.response.status = StatusCodes.UNAUTHORIZED
      }
    })
    .post("/:appname/api/changeMyPassword", async ctx => {
      await ctx.instance.authApi.changeMyPassword(
        ctx.request.body.currentPassword,
        ctx.request.body.newPassword
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/changeMyPassword", async ctx => {
      await ctx.instance.authApi.changeMyPassword(
        ctx.request.body.currentPassword,
        ctx.request.body.newPassword
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/executeAction/:actionname", async ctx => {
      ctx.body = await ctx.instance.actionApi.execute(
        ctx.request.body.actionname,
        ctx.request.body.parameters
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/createUser", async ctx => {
      await ctx.instance.authApi.createUser(
        ctx.request.body.user,
        ctx.request.body.password
      )

      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/enableUser", async ctx => {
      await ctx.instance.authApi.enableUser(ctx.request.body.username)
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/disableUser", async ctx => {
      await ctx.instance.authApi.disableUser(ctx.request.body.username)

      await ctx.master.removeSessionsForUser(
        ctx.params.appname,
        ctx.request.body.username
      )
      ctx.response.status = StatusCodes.OK
    })
    .get("/:appname/api/users", async ctx => {
      ctx.body = await ctx.instance.authApi.getUsers()
      ctx.response.status = StatusCodes.OK
    })
    .get("/:appname/api/accessLevels", async ctx => {
      ctx.body = await ctx.instance.authApi.getAccessLevels()
      ctx.response.status = StatusCodes.OK
    })
    .get("/:appname/api/listRecords/:indexkey", async ctx => {
      ctx.body = await ctx.instance.indexApi.listItems(ctx.params.indexkey)
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/listRecords/:indexkey", async ctx => {
      ctx.body = await ctx.instance.indexApi.listItems(
        ctx.request.body.indexKey,
        {
          rangeStartParams: ctx.request.body.rangeStartParams,
          rangeEndParams: ctx.request.body.rangeEndParams,
          searchPhrase: ctx.request.body.searchPhrase,
        }
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/aggregates/:indexkey", async ctx => {
      ctx.body = await ctx.instance.indexApi.aggregates(
        ctx.request.body.indexKey,
        {
          rangeStartParams: ctx.request.body.rangeStartParams,
          rangeEndParams: ctx.request.body.rangeEndParams,
          searchPhrase: ctx.request.body.searchPhrase,
        }
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/files/*", async ctx => {
      const file = ctx.request.files.file
      ctx.body = await ctx.instance.recordApi.uploadFile(
        getRecordKey(ctx.params.appname, ctx.request.path),
        fs.createReadStream(file.path),
        file.name
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/record/*", async ctx => {
      ctx.body = await ctx.instance.recordApi.save(ctx.request.body)
      ctx.response.status = StatusCodes.OK
    })
    .get("/:appname/api/lookup_field/*", async ctx => {
      const recordKey = getRecordKey(ctx.params.appname, ctx.request.path)
      const fields = ctx.query.fields.split(",")
      const recordContext = await ctx.instance.recordApi.getContext(recordKey)
      const allContext = []
      for (let field of fields) {
        allContext.push(await recordContext.referenceOptions(field))
      }
      ctx.body = allContext
      ctx.response.status = StatusCodes.OK
    })
    .get("/:appname/api/record/*", async ctx => {
      try {
        ctx.body = await ctx.instance.recordApi.load(
          getRecordKey(ctx.params.appname, ctx.request.path)
        )
        ctx.response.status = StatusCodes.OK
      } catch (e) {
        // need to be catching for 404s here
        ctx.response.status = StatusCodes.INTERAL_ERROR
        ctx.response.body = e.message
      }
    })
    .del("/:appname/api/record/*", async ctx => {
      await ctx.instance.recordApi.delete(
        getRecordKey(ctx.params.appname, ctx.request.path)
      )
      ctx.response.status = StatusCodes.OK
    })
    .post("/:appname/api/apphierarchy", async ctx => {
      ctx.body = await ctx.instance.templateApi.saveApplicationHierarchy(
        ctx.body
      )
      ctx.response.status = StatusCodes.OK
    })
  /*.post("/:appname/api/actionsAndTriggers", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveApplicationHierarchy(
            ctx.body
        );
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/appDefinition", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveActionsAndTriggers(
            ctx.body
        );
        ctx.response.status = StatusCodes.OK;
    })*/

  const getRecordKey = (appname, wholePath) =>
    wholePath
      .replace(`/${appname}/api/files/`, "")
      .replace(`/${appname}/api/lookup_field/`, "")
      .replace(`/${appname}/api/record/`, "")

  return router
}

/*
front end get authenticateTemporaryAccess {}
*/
