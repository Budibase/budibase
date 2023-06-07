if (process.env.DD_APM_ENABLED) {
  require("./ddApm")
}

// need to load environment first
import env from "./environment"

import { ExtendableContext } from "koa"
import * as db from "./db"
db.init()
import Koa from "koa"
import koaBody from "koa-body"
import http from "http"
import * as api from "./api"
import * as automations from "./automations"
import { Thread } from "./threads"
import * as redis from "./utilities/redis"
import { initialise as initialiseWebsockets } from "./websockets"
import { events, logging, middleware, timers } from "@budibase/backend-core"
import { startup } from "./startup"
const Sentry = require("@sentry/node")
const destroyable = require("server-destroy")
const { userAgent } = require("koa-useragent")

const app = new Koa()

let mbNumber = parseInt(env.HTTP_MB_LIMIT || "10")
if (!mbNumber || isNaN(mbNumber)) {
  mbNumber = 10
}
// set up top level koa middleware
app.use(
  koaBody({
    multipart: true,
    formLimit: `${mbNumber}mb`,
    jsonLimit: `${mbNumber}mb`,
    textLimit: `${mbNumber}mb`,
    // @ts-ignore
    enableTypes: ["json", "form", "text"],
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  })
)

app.use(middleware.correlation)
app.use(middleware.pino)
app.use(userAgent)

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

let shuttingDown = false,
  errCode = 0

server.on("close", async () => {
  // already in process
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  console.log("Server Closed")
  timers.cleanup()
  await automations.shutdown()
  await redis.shutdown()
  events.shutdown()
  await Thread.shutdown()
  api.shutdown()
  if (!env.isTest()) {
    process.exit(errCode)
  }
})

export default server.listen(env.PORT || 0, async () => {
  await startup(app, server)
})

const shutdown = () => {
  server.close()
  // @ts-ignore
  server.destroy()
}

process.on("uncaughtException", err => {
  // @ts-ignore
  // don't worry about this error, comes from zlib isn't important
  if (err && err["code"] === "ERR_INVALID_CHAR") {
    return
  }
  errCode = -1
  logging.logAlert("Uncaught exception.", err)
  shutdown()
})

process.on("SIGTERM", () => {
  shutdown()
})

process.on("SIGINT", () => {
  shutdown()
})
