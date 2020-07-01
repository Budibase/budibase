const Koa = require("koa")
const koaBody = require("koa-body")
const logger = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const env = require("./environment")
const eventEmitter = require("./events")

const app = new Koa()

// set up top level koa middleware
app.use(koaBody({ multipart: true }))

app.use(
  logger({
    prettyPrint: {
      levelFirst: true,
    },
    level: "info" || "info",
  })
)

app.context.eventEmitter = eventEmitter

// api routes
app.use(api.routes())

module.exports = async port => {
  const serverPort = port || env.PORT
  const server = http.createServer(app.callback())
  return server.listen(serverPort || 4001)
}
