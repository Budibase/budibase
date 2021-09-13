// need to load environment first
import { ExtendableContext } from "koa"

const env = require("./environment")
const CouchDB = require("./db")
require("@budibase/auth").init(CouchDB)
const Koa = require("koa")
const destroyable = require("server-destroy")
const koaBody = require("koa-body")
const pino = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const eventEmitter = require("./events")
const automations = require("./automations/index")
const Sentry = require("@sentry/node")
const fileSystem = require("./utilities/fileSystem")
const bullboard = require("./automations/bullboard")
const redis = require("./utilities/redis")
const convert = require("koa-convert")

const app = new Koa()

// set up top level koa middleware
app.use(
  koaBody({
    multipart: true,
    formLimit: "10mb",
    jsonLimit: "10mb",
    textLimit: "10mb",
    enableTypes: ["json", "form", "text"],
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  })
)

app.use(
  pino({
    prettyPrint: {
      levelFirst: true,
    },
    level: env.LOG_LEVEL || "error",
  })
)

if (!env.isTest()) {
  const bullApp = bullboard.init()
  app.use(async (ctx: ExtendableContext, next: () => any) => {
    if (ctx.path.startsWith(bullboard.pathPrefix)) {
      ctx.status = 200
      ctx.respond = false
      bullApp(ctx.req, ctx.res)
    } else {
      await next()
    }
  })
}

app.context.eventEmitter = eventEmitter
app.context.auth = {}

app.use(
  convert(async (ctx: ExtendableContext, next: () => any) => {
    await next()
    if (ctx.message) {
      ctx.message = encodeURIComponent(ctx.message)
    }
  })
)
// api routes
app.use(api.routes())

if (env.isProd()) {
  env._set("NODE_ENV", "production")
  Sentry.init()

  app.on("error", (err: any, ctx: ExtendableContext) => {
    Sentry.withScope(function (scope: any) {
      scope.addEventProcessor(function (event: any) {
        return Sentry.Handlers.parseRequest(event, ctx.request)
      })
      Sentry.captureException(err)
    })
  })
}

const server = http.createServer(app.callback())
destroyable(server)

server.on("close", async () => {
  if (env.NODE_ENV !== "jest") {
    console.log("Server Closed")
  }
  await redis.shutdown()
})

module.exports = server.listen(env.PORT || 0, async () => {
  console.log(`Budibase running on ${JSON.stringify(server.address())}`)
  env._set("PORT", server.address().port)
  eventEmitter.emitPort(env.PORT)
  fileSystem.init()
  await automations.init()
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
