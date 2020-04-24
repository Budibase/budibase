const Koa = require("koa")
const logger = require("koa-logger");
const router = require("./middleware/routers")
const koaBody = require("koa-body")
const app = new Koa()

module.exports = async () => {
  app.keys = Object.keys(process.env)
    .filter(k => k.startsWith("COOKIE_KEY_"))
    .map(k => process.env[k])
  app.use(koaBody({ multipart: true }))
  app.use(logger())
  app.use(router(app).routes())
  return app.listen(process.env.PORT || 4001)
}
