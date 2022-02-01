// need to load environment first
import { ExtendableContext } from "koa"

import * as env from "./environment"
const CouchDB = require("./db")
require("@budibase/backend-core").init(CouchDB)
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
import * as migrations from "./migrations"

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
  const plugin = bullboard.init()
  app.use(plugin)
}

app.context.eventEmitter = eventEmitter
app.context.auth = {}

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
  await redis.init()
  await automations.init()
})

const shutdown = () => {
  server.close()
  server.destroy()
}

process.on("uncaughtException", err => {
  console.error(err)
  shutdown()
})

process.on("SIGTERM", () => {
  shutdown()
})

// run migrations on startup if not done via http
// not recommended in a clustered environment
if (!env.HTTP_MIGRATIONS) {
  migrations.migrate().catch(err => {
    console.error("Error performing migrations. Exiting.\n", err)
    shutdown()
  })
}
