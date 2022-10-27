// need to load environment first
import * as env from "./environment"

// enable APM if configured
if (process.env.ELASTIC_APM_ENABLED) {
  const apm = require("elastic-apm-node").start({
    serviceName: process.env.SERVICE,
    environment: process.env.BUDIBASE_ENVIRONMENT,
  })
}

import { ExtendableContext } from "koa"
import db from "./db"
db.init()
const Koa = require("koa")
const destroyable = require("server-destroy")
const koaBody = require("koa-body")
const http = require("http")
const api = require("./api")
const automations = require("./automations/index")
const Sentry = require("@sentry/node")
const { logAlert } = require("@budibase/backend-core/logging")
const { Thread } = require("./threads")
import redis from "./utilities/redis"
import { events } from "@budibase/backend-core"
import { initialise as initialiseWebsockets } from "./websocket"
import { startup } from "./startup"

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
initialiseWebsockets(server)

let shuttingDown = false,
  errCode = 0
server.on("close", async () => {
  // already in process
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  console.log("Server Closed")
  await automations.shutdown()
  await redis.shutdown()
  await events.shutdown()
  await Thread.shutdown()
  api.shutdown()
  if (!env.isTest()) {
    process.exit(errCode)
  }
})

module.exports = server.listen(env.PORT || 0, async () => {
  await startup(app, server)
})

const shutdown = () => {
  server.close()
  server.destroy()
}

process.on("uncaughtException", err => {
  // @ts-ignore
  // don't worry about this error, comes from zlib isn't important
  if (err && err["code"] === "ERR_INVALID_CHAR") {
    return
  }
  errCode = -1
  logAlert("Uncaught exception.", err)
  shutdown()
})

process.on("SIGTERM", () => {
  shutdown()
})

process.on("SIGINT", () => {
  shutdown()
})
