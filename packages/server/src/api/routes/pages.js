const Router = require("@koa/router")
const StatusCodes = require("../../utilities/statusCodes")
const { listScreens, saveScreen, buildPage, renameScreen, deleteScreen } = require("../../utilities/builder")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router.post("/_builder/api/:appId/pages/:pageName", authorized(BUILDER), async ctx => {
  await buildPage(ctx.config, ctx.params.appId, ctx.params.pageName, ctx.request.body)
  ctx.response.status = StatusCodes.OK
})

router.get("/_builder/api/:appId/pages/:pagename/screens", authorized(BUILDER), async ctx => {
  ctx.body = await listScreens(ctx.config, ctx.params.appId, ctx.params.pagename)
  ctx.response.status = StatusCodes.OK
})

router.post("/_builder/api/:appId/pages/:pagename/screen", authorized(BUILDER), async ctx => {
  ctx.body = await saveScreen(ctx.config, ctx.params.appId, ctx.params.pagename, ctx.request.body)
  ctx.response.status = StatusCodes.OK
})

router.patch("/_builder/api/:appname/pages/:pagename/screen", authorized(BUILDER), async ctx => {
  await renameScreen(
    ctx.config,
    ctx.params.appname,
    ctx.params.pagename,
    ctx.request.body.oldname,
    ctx.request.body.newname
  )
  ctx.response.status = StatusCodes.OK
})

router.delete("/_builder/api/pages/:pagename/screens/:id", authorized(BUILDER), async ctx => {
  await deleteScreen(ctx.config, ctx.user.appId, ctx.params.pagename, ctx.params.id)

  ctx.response.status = StatusCodes.OK
})

module.exports = router
