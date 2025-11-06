if (process.env.DD_APM_ENABLED) {
  require("./ddApm")
}

// need to load environment first
import {
  auth,
  cache,
  env as coreEnv,
  events,
  features,
  logging,
  middleware,
  queue,
  redis,
  timers,
} from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { bootstrap } from "global-agent"
import http from "http"
import gracefulShutdown from "http-graceful-shutdown"
import Application, { Middleware } from "koa"
import koaBody from "koa-body"
import RedisStore from "koa-redis"
import api from "./api"
import { loadTemplateConfig } from "./constants/templates"
import * as db from "./db"
import env from "./environment"

db.init()

const koaSession = require("koa-session")

import { userAgent } from "koa-useragent"

import { initPro } from "./initPro"
import { handleScimBody } from "./middleware/handleScimBody"

if (coreEnv.ENABLE_SSO_MAINTENANCE_MODE) {
  console.warn(
    "Warning: ENABLE_SSO_MAINTENANCE_MODE is set. It is recommended this flag is disabled if maintenance is not in progress"
  )
}

// this will setup http and https proxies form env variables
bootstrap()

const app: Application = new Application()

app.keys = ["secret", "key"]
app.proxy = true

// set up top level koa middleware
app.use(handleScimBody)
app.use(
  koaBody({
    multipart: true,
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  })
)

let store: any

const sessionMiddleware: Middleware = async (ctx: any, next: any) => {
  if (!store) {
    const redisClient = await redis.clients.getSessionClient()
    // @ts-expect-error - koa-redis types are weird
    store = RedisStore({ client: redisClient.client })
  }

  return koaSession(
    {
      store,
      key: "koa:sess",
      maxAge: 86400000, // one day
    },
    app
  )(ctx, next)
}

app.use(sessionMiddleware)

app.use(middleware.correlation)
app.use(middleware.pino)
app.use(middleware.ip)
if (!coreEnv.DISABLE_CONTENT_SECURITY_POLICY) {
  app.use(middleware.csp)
}
app.use(userAgent)

// authentication
app.use(auth.passport.initialize())
app.use(auth.passport.session())

// api routes
app.use(api.routes())

const server = http.createServer(app.callback())

server.timeout = parseInt(env.HTTP_SERVER_TIMEOUT_MS || "600000")
server.headersTimeout = parseInt(env.HTTP_HEADERS_TIMEOUT_MS || "120000")
server.requestTimeout = parseInt(env.HTTP_REQUEST_TIMEOUT_MS || "1200000")
server.keepAliveTimeout = parseInt(env.HTTP_KEEPALIVE_TIMEOUT_MS || "5000")

const shutdown = async (signal?: string) => {
  console.log(
    `Worker service shutting down gracefully... ${signal ? `Signal: ${signal}` : ""}`
  )
  timers.cleanup()
  await events.shutdown()
  await redis.clients.shutdown()
  await queue.shutdown()
}

gracefulShutdown(server, {
  signals: "SIGINT SIGTERM",
  timeout: 30000,
  onShutdown: shutdown,
  forceExit: !env.isTest(),
  finally: () => {
    console.log("Worker service shutdown complete")
  },
})

process.on("uncaughtException", async err => {
  logging.logAlert("Uncaught exception.", err)
  await shutdown()
  if (!env.isTest()) {
    process.exit(1)
  }
})

process.on("unhandledRejection", async reason => {
  logging.logAlert("Unhandled Promise Rejection", reason as Error)
  await shutdown()
  if (!env.isTest()) {
    process.exit(1)
  }
})

export default server.listen(parseInt(env.PORT || "4002"), async () => {
  let startupLog = `Worker running on ${JSON.stringify(server.address())}`
  if (env.BUDIBASE_ENVIRONMENT) {
    startupLog = `${startupLog} - environment: "${env.BUDIBASE_ENVIRONMENT}"`
  }
  console.log(startupLog)

  await initPro()
  await redis.clients.init()
  features.init()

  if (env.EMAIL_TEMPLATE_PATH) {
    await loadTemplateConfig(env.EMAIL_TEMPLATE_PATH)
  }

  cache.docWritethrough.init()
  // configure events to use the pro audit log write
  // can't integrate directly into backend-core due to cyclic issues
  await events.processors.init(proSdk.auditLogs.write)
})
