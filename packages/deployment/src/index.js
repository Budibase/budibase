const Koa = require("koa")
const destroyable = require("server-destroy")
const koaBody = require("koa-body")
const logger = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const env = require("./environment")

const app = new Koa()

if (!env.SELF_HOSTED) {
  throw "Currently this service only supports use in self hosting"
}

// set up top level koa middleware
app.use(koaBody({ multipart: true }))

app.use(
  logger({
    prettyPrint: {
      levelFirst: true,
    },
    level: env.LOG_LEVEL || "error",
  })
)

// api routes
app.use(api.routes())

const server = http.createServer(app.callback())
destroyable(server)

server.on("close", () => console.log("Server Closed"))

module.exports = server.listen(env.PORT || 4002, async () => {
  console.log(`Deployment running on ${JSON.stringify(server.address())}`)
})

process.on("uncaughtException", err => {
  console.error(err)
  server.close()
  server.destroy()
})

process.on("SIGTERM", () => {
  server.close()
  server.destroy()
})
