const Koa = require("koa")
const koaBody = require("koa-body")
const logger = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const env = require("./environment")
const eventPublisher = require("./events")

const app = new Koa()

// set up top level koa middleware
app.use(koaBody({ multipart: true }))

app.use(
  logger({
    prettyPrint: {
      levelFirst: true,
    },
    level: process.env.NODE_ENV === "jest" ? "silent" : "info",
  })
)

app.context.publisher = eventPublisher

// api routes
app.use(api.routes())

module.exports = async port => {
  const serverPort = port || env.PORT
  const server = http.createServer(app.callback())
  return server.listen(serverPort || 4001)
}
