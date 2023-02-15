if (process.env.DD_APM_ENABLED) {
  require("./ddApm")
}

if (process.env.ELASTIC_APM_ENABLED) {
  require("./elasticApm")
}

// need to load environment first
import env from "./environment"
import { Scope } from "@sentry/node"
import { Event } from "@sentry/types/dist/event"
import Application from "koa"
import { bootstrap } from "global-agent"
import * as db from "./db"
import { auth, logging, events, middleware } from "@budibase/backend-core"
db.init()
import Koa from "koa"
import koaBody from "koa-body"
import http from "http"
import api from "./api"
import * as redis from "./utilities/redis"
const Sentry = require("@sentry/node")
const koaSession = require("koa-session")
const logger = require("koa-pino-logger")
import destroyable from "server-destroy"

// this will setup http and https proxies form env variables
bootstrap()

const app: Application = new Koa()

app.keys = ["secret", "key"]

// set up top level koa middleware
app.use(koaBody({ multipart: true }))
app.use(koaSession(app))
app.use(middleware.logging)
app.use(logger(logging.pinoSettings()))

// authentication
app.use(auth.passport.initialize())
app.use(auth.passport.session())

// api routes
app.use(api.routes())

// sentry
if (env.isProd()) {
  Sentry.init()

  app.on("error", (err, ctx) => {
    Sentry.withScope(function (scope: Scope) {
      scope.addEventProcessor(function (event: Event) {
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
  if (shuttingDown) {
    return
  }
  shuttingDown = true
  console.log("Server Closed")
  await redis.shutdown()
  await events.shutdown()
  if (!env.isTest()) {
    process.exit(errCode)
  }
})

const shutdown = () => {
  server.close()
  server.destroy()
}

export default server.listen(parseInt(env.PORT || "4002"), async () => {
  console.log(`Worker running on ${JSON.stringify(server.address())}`)
  await redis.init()
})

process.on("uncaughtException", err => {
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
