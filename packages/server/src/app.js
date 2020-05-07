const Koa = require("koa")
const logger = require("koa-logger")
const api = require("./api")
const koaBody = require("koa-body")

const app = new Koa()

// set up top level koa middleware
app.use(koaBody({ multipart: true }))
app.use(logger())

// api routes
app.use(api.routes())

module.exports = app.listen(process.env.PORT || 4001)
