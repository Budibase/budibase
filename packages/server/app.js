const Koa = require("koa")
const router = require("./middleware/routers")
const koaBody = require("koa-body")
const initialiseRuntimePackages = require("./initialise/initialiseRuntimePackages")

const app = new Koa()

module.exports = async budibaseContext => {
  const { config } = budibaseContext
  app.keys = config.keys
  app.context.master = budibaseContext.master
  app.context.getAppPackage = await initialiseRuntimePackages(
    budibaseContext,
    app.context.master,
    config.latestPackagesFolder
  )
  app.use(koaBody({ multipart: true }))
  app.use(router(config, app).routes())
  return app.listen(config.port)
}
