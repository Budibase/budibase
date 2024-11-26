import env from "../environment"
import * as redis from "../utilities/redis"
import { generateApiKey, getChecklist } from "../utilities/workerRequests"
import {
  events,
  installation,
  logging,
  tenancy,
  users,
  cache,
  env as coreEnv,
  features,
} from "@budibase/backend-core"
import { watch } from "../watch"
import * as automations from "../automations"
import * as fileSystem from "../utilities/fileSystem"
import { default as eventEmitter, init as eventInit } from "../events"
import * as migrations from "../migrations"
import * as bullboard from "../automations/bullboard"
import * as appMigrations from "../appMigrations/queue"
import * as pro from "@budibase/pro"
import * as api from "../api"
import sdk from "../sdk"
import { initialise as initialiseWebsockets } from "../websockets"
import { automationsEnabled, printFeatures } from "../features"
import * as jsRunner from "../jsRunner"
import Koa from "koa"
import { Server } from "http"
import { AddressInfo } from "net"
import fs from "fs"
import bson from "bson"

let STARTUP_RAN = false

async function initRoutes(app: Koa) {
  if (!env.isTest()) {
    const plugin = await bullboard.init()
    app.use(plugin)
  }

  app.context.eventEmitter = eventEmitter
  app.context.auth = {}

  // api routes
  app.use(api.router.routes())
  app.use(api.router.allowedMethods())
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

function shutdown(server?: Server) {
  if (server) {
    server.close()
    server.destroy()
  }
}

export async function startup(
  opts: { app?: Koa; server?: Server; rerun?: boolean } = {}
) {
  const { app, server, rerun } = opts
  if (STARTUP_RAN && !rerun) {
    return
  }
  printFeatures()
  if (env.BUDIBASE_ENVIRONMENT) {
    console.log(`service running environment: "${env.BUDIBASE_ENVIRONMENT}"`)
  }
  STARTUP_RAN = true
  if (app && server && !env.CLUSTER_MODE) {
    console.log(`Budibase running on ${JSON.stringify(server.address())}`)
    const address = server.address() as AddressInfo
    env._set("PORT", address.port)
  }

  console.log("Emitting port event")
  eventEmitter.emitPort(env.PORT)

  console.log("Initialising file system")
  fileSystem.init()

  console.log("Initialising redis")
  await redis.init()

  console.log("Initialising writethrough cache")
  cache.docWritethrough.init()

  console.log("Initialising events")
  eventInit()

  console.log("Initialising feature flags")
  features.init()

  if (app && server) {
    console.log("Initialising websockets")
    initialiseWebsockets(app, server)
  }

  // run migrations on startup if not done via http
  // not recommended in a clustered environment
  if (!env.HTTP_MIGRATIONS && !env.isTest()) {
    console.log("Running migrations")
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
    console.log("Monitoring plugin directory")
    watch()
  }

  // check for version updates
  console.log("Checking for version updates")
  await installation.checkInstallVersion()

  console.log("Initialising queues")
  // get the references to the queue promises, don't await as
  // they will never end, unless the processing stops
  let queuePromises = []
  // configure events to use the pro audit log write
  // can't integrate directly into backend-core due to cyclic issues
  queuePromises.push(events.processors.init(pro.sdk.auditLogs.write))
  // app migrations and automations on other service
  if (automationsEnabled()) {
    queuePromises.push(automations.init())
    queuePromises.push(appMigrations.init())
  }
  queuePromises.push(initPro())
  if (app) {
    console.log("Initialising routes")
    // bring routes online as final step once everything ready
    await initRoutes(app)
  }

  // check and create admin user if required
  // this must be run after the api has been initialised due to
  // the app user sync
  const bbAdminEmail = coreEnv.BB_ADMIN_USER_EMAIL,
    bbAdminPassword = coreEnv.BB_ADMIN_USER_PASSWORD
  if (
    env.SELF_HOSTED &&
    !env.MULTI_TENANCY &&
    bbAdminEmail &&
    bbAdminPassword
  ) {
    console.log("Initialising admin user")
    const tenantId = tenancy.getTenantId()
    await tenancy.doInTenant(tenantId, async () => {
      const exists = await users.doesUserExist(bbAdminEmail)
      const checklist = await getChecklist()
      if (!checklist?.adminUser?.checked || !exists) {
        try {
          const user = await users.UserDB.createAdminUser(
            bbAdminEmail,
            tenantId,
            {
              password: bbAdminPassword,
              hashPassword: true,
              requirePassword: true,
              skipPasswordValidation: true,
            }
          )
          // Need to set up an API key for automated integration tests
          if (env.isTest()) {
            await generateApiKey(user._id!)
          }

          console.log("Admin account automatically created for", bbAdminEmail)
        } catch (e) {
          logging.logAlert("Error creating initial admin user. Exiting.", e)
          shutdown(server)
        }
      }
    })
  }

  if (coreEnv.BSON_BUFFER_SIZE) {
    bson.setInternalBufferSize(coreEnv.BSON_BUFFER_SIZE)
  }

  console.log("Initialising JS runner")
  jsRunner.init()
}
