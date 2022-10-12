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
const pino = require("koa-pino-logger")
const http = require("http")
const api = require("./api")
const eventEmitter = require("./events")
const automations = require("./automations/index")
const Sentry = require("@sentry/node")
const fileSystem = require("./utilities/fileSystem")
const bullboard = require("./automations/bullboard")
const { logAlert } = require("@budibase/backend-core/logging")
const { pinoSettings } = require("@budibase/backend-core")
const { Thread } = require("./threads")
const fs = require("fs")
import redis from "./utilities/redis"
import * as migrations from "./migrations"
import { events, installation, tenancy } from "@budibase/backend-core"
import {
  createAdminUser,
  generateApiKey,
  getChecklist,
} from "./utilities/workerRequests"
import { watch } from "./watch"
import { initialise as initialiseWebsockets } from "./websocket"

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

app.use(pino(pinoSettings()))

if (!env.isTest()) {
  const plugin = bullboard.init()
  app.use(plugin)
}

app.context.eventEmitter = eventEmitter
app.context.auth = {}

// api routes
app.use(api.router.routes())

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
  console.log(`Budibase running on ${JSON.stringify(server.address())}`)
  env._set("PORT", server.address().port)
  eventEmitter.emitPort(env.PORT)
  fileSystem.init()
  await redis.init()

  // run migrations on startup if not done via http
  // not recommended in a clustered environment
  if (!env.HTTP_MIGRATIONS && !env.isTest()) {
    try {
      await migrations.migrate()
    } catch (e) {
      logAlert("Error performing migrations. Exiting.", e)
      shutdown()
    }
  }

  // check and create admin user if required
  if (
    env.SELF_HOSTED &&
    !env.MULTI_TENANCY &&
    env.BB_ADMIN_USER_EMAIL &&
    env.BB_ADMIN_USER_PASSWORD
  ) {
    const checklist = await getChecklist()
    if (!checklist?.adminUser?.checked) {
      try {
        const tenantId = tenancy.getTenantId()
        const user = await createAdminUser(
          env.BB_ADMIN_USER_EMAIL,
          env.BB_ADMIN_USER_PASSWORD,
          tenantId
        )
        // Need to set up an API key for automated integration tests
        if (env.isTest()) {
          await generateApiKey(user._id)
        }

        console.log(
          "Admin account automatically created for",
          env.BB_ADMIN_USER_EMAIL
        )
      } catch (e) {
        logAlert("Error creating initial admin user. Exiting.", e)
        shutdown()
      }
    }
  }

  // monitor plugin directory if required
  if (
    env.SELF_HOSTED &&
    !env.MULTI_TENANCY &&
    env.PLUGINS_DIR &&
    fs.existsSync(env.PLUGINS_DIR)
  ) {
    watch()
  }

  // check for version updates
  await installation.checkInstallVersion()

  // done last - this will never complete
  await automations.init()
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
