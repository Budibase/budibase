import {
  cache,
  env as coreEnv,
  events,
  features,
  installation,
  logging,
  tenancy,
  users,
} from "@budibase/backend-core"
import * as pro from "@budibase/pro"
import bson from "bson"
import fs from "fs"
import { Server } from "http"
import Koa from "koa"
import { AddressInfo } from "net"
import * as api from "../api"
import * as automations from "../automations"
import * as bullboard from "../automations/bullboard"
import env from "../environment"
import { default as eventEmitter, init as eventInit } from "../events"
import { automationsEnabled, printFeatures } from "../features"
import * as jsRunner from "../jsRunner"
import sdk from "../sdk"
import * as fileSystem from "../utilities/fileSystem"
import * as redis from "../utilities/redis"
import { generateApiKey, getChecklist } from "../utilities/workerRequests"
import { watch } from "../watch"
import { initialise as initialiseWebsockets } from "../websockets"
import * as workspaceMigrations from "../workspaceMigrations/queue"
import { rag } from "../sdk/workspace/ai"

export type State = "uninitialised" | "starting" | "ready"
let STATE: State = "uninitialised"

export interface QueueInitOptions {
  events?: boolean
  rag?: boolean
  automations?: boolean
  workspaceMigrations?: boolean
  pro?: boolean
  dev?: boolean
}

const INITIALISED_QUEUES: Required<QueueInitOptions> = {
  events: false,
  rag: false,
  automations: false,
  workspaceMigrations: false,
  pro: false,
  dev: false,
}

export function getState(): State {
  return STATE
}

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

export function initQueues(opts: QueueInitOptions = {}) {
  const options: Required<QueueInitOptions> = {
    events: opts.events ?? true,
    rag: opts.rag ?? true,
    automations: opts.automations ?? true,
    workspaceMigrations: opts.workspaceMigrations ?? true,
    pro: opts.pro ?? true,
    dev: opts.dev ?? true,
  }

  const queuePromises = []

  if (options.events && !INITIALISED_QUEUES.events) {
    console.log("Initialising events queue")
    queuePromises.push(events.processors.init(pro.sdk.auditLogs.write))
    INITIALISED_QUEUES.events = true
  }

  if (options.rag && !INITIALISED_QUEUES.rag) {
    console.log("Initialising RAG queue")
    queuePromises.push(rag.queue.init())
    INITIALISED_QUEUES.rag = true
  }

  if (
    options.automations &&
    !INITIALISED_QUEUES.automations &&
    automationsEnabled()
  ) {
    console.log("Initialising automations queue")
    queuePromises.push(automations.init())
    INITIALISED_QUEUES.automations = true
  }

  if (
    options.workspaceMigrations &&
    !INITIALISED_QUEUES.workspaceMigrations &&
    automationsEnabled()
  ) {
    console.log("Initialising workspace migrations queue")
    queuePromises.push(workspaceMigrations.init())
    INITIALISED_QUEUES.workspaceMigrations = true
  }

  if (options.pro && !INITIALISED_QUEUES.pro) {
    console.log("Initialising pro queue integrations")
    queuePromises.push(initPro())
    INITIALISED_QUEUES.pro = true
  }

  if (options.dev && !INITIALISED_QUEUES.dev) {
    console.log("Initialising dev queue")
    queuePromises.push(sdk.dev.init())
    INITIALISED_QUEUES.dev = true
  }
}

export async function startup(
  opts: {
    app?: Koa
    server?: Server
    force?: boolean
    initQueues?: boolean
  } = {}
) {
  const { app, server } = opts
  if (STATE !== "uninitialised" && !opts.force) {
    console.log("Budibase already started")
    return
  }
  STATE = "starting"
  printFeatures()
  if (env.BUDIBASE_ENVIRONMENT) {
    console.log(`service running environment: "${env.BUDIBASE_ENVIRONMENT}"`)
  }
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

  if (opts.initQueues ?? true) {
    initQueues()
  }
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
          throw e
        }
      }
    })
  }

  if (coreEnv.BSON_BUFFER_SIZE) {
    bson.setInternalBufferSize(coreEnv.BSON_BUFFER_SIZE)
  }

  console.log("Initialising JS runner")
  jsRunner.init()

  STATE = "ready"
}
