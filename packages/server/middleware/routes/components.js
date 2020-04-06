const Router = require("@koa/router");
const send = require("koa-send")
const {
  getComponentDefinitions,
  componentLibraryInfo,
} = require("../../utilities/builder")


const router = Router();

router.get("/_builder/api/:appname/components", async ctx => {
  try {
    ctx.body = getComponentDefinitions(
      ctx.config,
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

router.get("/_builder/api/:appname/componentlibrary", async ctx => {
  const info = await componentLibraryInfo(
    ctx.config,
    ctx.params.appname,
    ctx.query.lib ? decodeURI(ctx.query.lib) : ""
  )
  ctx.body = info.components
  ctx.response.status = StatusCodes.OK
})

router.get("/_builder/:appname/componentlibrary", async ctx => {
  const info = await componentLibraryInfo(
    ctx.config,
    ctx.params.appname,
    ctx.query.lib
  )
  await send(ctx, info.components._lib || "index.js", { root: info.libDir })
})

module.exports = router