import env from "./environment"
import * as redis from "./utilities/redis"
import {
  createAdminUser,
  generateApiKey,
  getChecklist,
} from "./utilities/workerRequests"
import { events, installation, logging, tenancy } from "@budibase/backend-core"
import fs from "fs"
import { watch } from "./watch"
import * as automations from "./automations"
import * as fileSystem from "./utilities/fileSystem"
import { default as eventEmitter, init as eventInit } from "./events"
import * as migrations from "./migrations"
import * as bullboard from "./automations/bullboard"
import * as pro from "@budibase/pro"
import * as api from "./api"
import sdk from "./sdk"
import { initialise as initialiseWebsockets } from "./websockets"
import { automationsEnabled } from "./features"

let STARTUP_RAN = false

async function initRoutes(app: any) {
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
  if (server) {
    server.close()
    server.destroy()
  }
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
  eventInit()
  initialiseWebsockets(app, server)

  // run migrations on startup if not done via http
  // not recommended in a clustered environment
  if (!env.HTTP_MIGRATIONS && !env.isTest()) {
    try {
      await migrations.migrate()
    } catch (e) {
      logging.logAlert("Error performing migrations. Exiting.", e)
      shutdown(server)
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
  // configure events to use the pro audit log write
  // can't integrate directly into backend-core due to cyclic issues
  queuePromises.push(events.processors.init(pro.sdk.auditLogs.write))
  if (automationsEnabled()) {
    queuePromises.push(automations.init())
  }
  queuePromises.push(initPro())
  if (app) {
    // bring routes online as final step once everything ready
    await initRoutes(app)
  }

  // check and create admin user if required
  // this must be run after the api has been initialised due to
  // the app user sync
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
        shutdown(server)
      }
    }
  }
}
