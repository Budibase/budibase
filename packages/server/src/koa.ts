import env from "./environment"
import Koa from "koa"
import koaBody, { HttpMethodEnum } from "koa-body"
import http from "http"
import * as api from "./api"
import * as automations from "./automations"
import { Thread } from "./threads"
import * as redis from "./utilities/redis"
import { events, logging, middleware, timers } from "@budibase/backend-core"
import { userAgent } from "koa-useragent"
import gracefulShutdown from "http-graceful-shutdown"

export default function createKoaApp() {
  const app = new Koa()
  app.proxy = true
  const parsedMethods = [
    HttpMethodEnum.POST,
    HttpMethodEnum.PUT,
    HttpMethodEnum.PATCH,
    HttpMethodEnum.DELETE,
  ]

  let mbNumber = parseInt(env.HTTP_MB_LIMIT || "10")
  if (!mbNumber || isNaN(mbNumber)) {
    mbNumber = 10
  }
  const defaultBodyParser = koaBody({
    multipart: true,
    formLimit: `${mbNumber}mb`,
    jsonLimit: `${mbNumber}mb`,
    textLimit: `${mbNumber}mb`,
    parsedMethods,
    formidable: {
      maxFileSize: parseInt(env.MAX_IMPORT_SIZE_MB || "100") * 1024 * 1024,
    },
  })

  app.use(async (ctx, next) => {
    if (
      ctx.path.startsWith("/api/webhooks/discord/") ||
      ctx.path.startsWith("/api/webhooks/ms-teams/") ||
      ctx.path.startsWith("/api/webhooks/slack/") ||
      ctx.path.startsWith("/api/webhooks/telegram/")
    ) {
      return await next()
    }
    return await defaultBodyParser(ctx, async () => {
      // Koa 3 + koa-body can leave request.body undefined for empty payloads.
      // Preserve previous behavior expected across controllers/tests.
      if (
        ctx.request.body == null &&
        parsedMethods.includes(ctx.method as HttpMethodEnum)
      ) {
        ctx.request.body = {}
      }
      await next()
    })
  })

  app.use(middleware.correlation)
  app.use(middleware.pino)
  app.use(middleware.ip)
  app.use(userAgent)

  const server = http.createServer(app.callback())

  server.timeout = parseInt(env.HTTP_SERVER_TIMEOUT_MS || "60000")
  server.headersTimeout = parseInt(env.HTTP_HEADERS_TIMEOUT_MS || "12000")
  server.requestTimeout = parseInt(env.HTTP_REQUEST_TIMEOUT_MS || "120000")
  server.keepAliveTimeout = parseInt(env.HTTP_KEEPALIVE_TIMEOUT_MS || "15000")

  const shutdown = async () => {
    console.log("Server shutting down gracefully...")
    timers.cleanup()
    await automations.shutdown()
    await redis.shutdown()
    events.shutdown()
    await Thread.shutdown()
    api.shutdown()
  }

  gracefulShutdown(server, {
    signals: "SIGINT SIGTERM",
    timeout: 30000, // in ms
    onShutdown: shutdown,
    forceExit: !env.isTest(),
    finally: () => {
      console.log("Server shutdown complete")
    },
  })

  process.on("uncaughtException", async err => {
    // @ts-ignore
    // don't worry about this error, comes from zlib isn't important
    if (err?.["code"] === "ERR_INVALID_CHAR") {
      logging.logAlert("Uncaught exception.", err)
      return
    }
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

  const listener = server.listen(env.PORT || 0)

  return { app, server: listener }
}
