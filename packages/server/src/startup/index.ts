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

class LiteLLMReadinessTimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`LiteLLM did not become ready within ${timeoutMs}ms`)
    this.name = "LiteLLMReadinessTimeoutError"
  }
}

export function getState(): State {
  return STATE
}

async function waitForLiteLLMReadiness() {
  if (!env.LITELLM_MASTER_KEY) {
    return
  }

  const timeoutMs = env.LITELLM_READINESS_TIMEOUT_MS
  const pollMs = env.LITELLM_READINESS_POLL_MS
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), pollMs)
    const status = await sdk.ai.configs.getLiteLLMStatus({
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (status === sdk.ai.configs.LiteLLMStatus.OK) {
      console.log(`LiteLLM ready after waiting ${Date.now() - start}ms`)
      return
    }

    if (status === sdk.ai.configs.LiteLLMStatus.NOT_CONFIGURED) {
      console.warn(`LiteLLM not configured ${Date.now() - start}ms`)
      return
    }

    await new Promise(resolve => setTimeout(resolve, pollMs))
  }

  throw new LiteLLMReadinessTimeoutError(timeoutMs)
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
        exportWorkspaceFn: sdk.backups.exportWorkspace,
        importWorkspaceFn: sdk.backups.importApp,
        statsFn: sdk.backups.calculateBackupStats,
      },
    },
  })
}

export async function startup(
  opts: { app?: Koa; server?: Server; force?: boolean } = {}
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

  console.log("Initialising queues")
  // get the references to the queue promises, don't await as
  // they will never end, unless the processing stops
  let queuePromises = []
  // configure events to use the pro audit log write
  // can't integrate directly into backend-core due to cyclic issues
  queuePromises.push(events.processors.init(pro.sdk.auditLogs.write))
  queuePromises.push(rag.queue.init())
  // app migrations and automations on other service
  if (automationsEnabled()) {
    queuePromises.push(automations.init())
    queuePromises.push(workspaceMigrations.init())
  }
  queuePromises.push(initPro())
  queuePromises.push(sdk.dev.init())
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

  console.log("Waiting for LiteLLM readiness")

  await waitForLiteLLMReadiness().catch(e => {
    if (e instanceof LiteLLMReadinessTimeoutError) {
      console.warn(e.message)
      return
    }

    console.warn("Error waiting for LiteLLM readiness", e)
  })

  console.log("Server ready!")
  STATE = "ready"
}
