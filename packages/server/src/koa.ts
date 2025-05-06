import env from "./environment"
import Koa from "koa"
import koaBody from "koa-body"
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
      formidable: {
        maxFileSize: parseInt(env.MAX_IMPORT_SIZE_MB || "100") * 1024 * 1024,
      },
    })
  )

  app.use(middleware.correlation)
  app.use(middleware.pino)
  app.use(middleware.ip)
  app.use(userAgent)

  const server = http.createServer(app.callback())

  let shuttingDown = false

  const shutdown = async () => {
    if (shuttingDown) return
    shuttingDown = true
    console.log(`Server shutting down gracefully...`)

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
    finally: () => {
      console.log("Server shutdown complete")
    },
  })

  process.on("uncaughtException", err => {
    // @ts-ignore
    // don't worry about this error, comes from zlib isn't important
    if (err?.["code"] === "ERR_INVALID_CHAR") return
    logging.logAlert("Uncaught exception.", err)
    shutdown()
    process.exit(1)
  })

  process.on("unhandledRejection", reason => {
    logging.logAlert("Unhandled Promise Rejection", reason as Error)
    shutdown()
    process.exit(1)
  })

  const listener = server.listen(env.PORT || 0)

  return { app, server: listener }
}
