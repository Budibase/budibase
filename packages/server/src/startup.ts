import * as env from "./environment"
import * as redis from "./utilities/redis"
import {
  createAdminUser,
  generateApiKey,
  getChecklist,
} from "./utilities/workerRequests"
import {
  installation,
  pinoSettings,
  tenancy,
  logging,
} from "@budibase/backend-core"
import fs from "fs"
import { watch } from "./watch"
import * as automations from "./automations"
import * as fileSystem from "./utilities/fileSystem"
import eventEmitter from "./events"
import * as migrations from "./migrations"
import * as bullboard from "./automations/bullboard"
import * as pro from "@budibase/pro"
import * as api from "./api"
import sdk from "./sdk"
const pino = require("koa-pino-logger")

let STARTUP_RAN = false

async function initRoutes(app: any) {
  app.use(pino(pinoSettings()))

  if (!env.isTest()) {
    const plugin = await bullboard.init()
    app.use(plugin)
  }

  app.context.eventEmitter = eventEmitter
  app.context.auth = {}

  // api routes
  app.use(api.router.routes())
}

async function initPro() {
  await pro.init({
    backups: {
      processing: {
        exportAppFn: sdk.backups.exportApp,
        importAppFn: sdk.backups.importApp,
        statsFn: sdk.backups.calculateBackupStats,
      },
    },
  })
}

function shutdown(server?: any) {
  server.close()
  server.destroy()
}

export async function startup(app?: any, server?: any) {
  if (STARTUP_RAN) {
    return
  }
  STARTUP_RAN = true
  if (server) {
    console.log(`Budibase running on ${JSON.stringify(server.address())}`)
    env._set("PORT", server.address().port)
  }
  eventEmitter.emitPort(env.PORT)
  fileSystem.init()
  await redis.init()

  // run migrations on startup if not done via http
  // not recommended in a clustered environment
  if (!env.HTTP_MIGRATIONS && !env.isTest()) {
    try {
      await migrations.migrate()
    } catch (e) {
      logging.logAlert("Error performing migrations. Exiting.", e)
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
        logging.logAlert("Error creating initial admin user. Exiting.", e)
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

  // get the references to the queue promises, don't await as
  // they will never end, unless the processing stops
  let queuePromises = []
  queuePromises.push(automations.init())
  queuePromises.push(initPro())
  if (app) {
    // bring routes online as final step once everything ready
    await initRoutes(app)
  }
}
