import env from "./environment"
import Koa from "koa"
import koaBody from "koa-body"
import http from "http"
import * as api from "./api"
import * as automations from "./automations"
import { Thread } from "./threads"
import * as redis from "./utilities/redis"
import {
  events,
  logging,
  middleware,
  timers,
  env as coreEnv,
} from "@budibase/backend-core"
import { userAgent } from "koa-useragent"
import destroyable from "server-destroy"
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
  if (!coreEnv.DISABLE_CONTENT_SECURITY_POLICY) {
    app.use(middleware.csp)
  }
  app.use(userAgent)

  const server = http.createServer(app.callback())
  destroyable(server)
  // let shuttingDown = false
  let errCode = 0

  const listener = server.listen(env.PORT || 0)

  gracefulShutdown(server, {
    onShutdown: async () => {
      console.log("Server is shutting down gracefully...")
      timers.cleanup()
      await automations.shutdown()
      await redis.shutdown()
      events.shutdown()
      await Thread.shutdown()
      api.shutdown()
    },
    finally: () => {
      if (!env.isTest()) {
        process.exit(errCode)
      }
    },
  })

  process.on("uncaughtException", err => {
    // @ts-ignore
    // don't worry about this error, comes from zlib isn't important
    if (err && err["code"] === "ERR_INVALID_CHAR") {
      return
    }
    errCode = -1
    logging.logAlert("Uncaught exception.", err)
    // Trigger graceful shutdown
    process.kill(process.pid, "SIGTERM")
  })

  return { app, server: listener }
}
