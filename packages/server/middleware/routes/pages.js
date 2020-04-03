const Router = require("@koa/router");
const {
  listScreens,
  saveScreen,
  buildPage
} = require("../../utilities/builder")


const router = Router()

router.get("/_builder/api/:appname/pages/:pagename/screens", async ctx => {
  ctx.body = await listScreens(
    config,
    ctx.params.appname,
    ctx.params.pagename
  )
  ctx.response.status = StatusCodes.OK
})

router
  .post("/_builder/api/:appname/pages/:pagename/screen", async ctx => {
    ctx.body = await saveScreen(
      config,
      ctx.params.appname,
      ctx.params.pagename,
      ctx.request.body
    )
    ctx.response.status = StatusCodes.OK
  })

router
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

router
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

router.post("/_builder/api/:appname/pages/:pageName", async ctx => {
  await buildPage(
    config,
    ctx.params.appname,
    ctx.params.pageName,
    ctx.request.body
  )
  ctx.response.status = StatusCodes.OK
})

module.exports = router