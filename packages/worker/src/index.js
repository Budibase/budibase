// need to load environment first
const env = require("./environment")
const CouchDB = require("./db")
require("@budibase/auth").init(CouchDB)
const Koa = require("koa")
const destroyable = require("server-destroy")
const koaBody = require("koa-body")
const koaSession = require("koa-session")
const { passport } = require("@budibase/auth").auth
const logger = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const redis = require("./utilities/redis")

const app = new Koa()

app.keys = ["secret", "key"]

// set up top level koa middleware
app.use(koaBody({ multipart: true }))
app.use(koaSession(app))

app.use(
  logger({
    prettyPrint: {
      levelFirst: true,
    },
    level: env.LOG_LEVEL || "error",
  })
)

// authentication
app.use(passport.initialize())
app.use(passport.session())

// api routes
app.use(api.routes())

const server = http.createServer(app.callback())
destroyable(server)

server.on("close", async () => {
  if (env.isProd()) {
    console.log("Server Closed")
  }
  await redis.shutdown()
})

module.exports = server.listen(parseInt(env.PORT || 4002), async () => {
  console.log(`Worker running on ${JSON.stringify(server.address())}`)
  await redis.init()
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
