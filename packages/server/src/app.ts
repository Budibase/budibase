if (process.env.DD_APM_ENABLED) {
  require("./ddApm")
}

import * as db from "./db"

db.init()
import { ServiceType } from "@budibase/types"
import { env as coreEnv } from "@budibase/backend-core"

coreEnv._set("SERVICE_TYPE", ServiceType.APPS)
import createKoaApp from "./koa"
import Koa from "koa"
import { Server } from "http"
import { startup } from "./startup"

let app: Koa, server: Server, started: Promise<void>

async function start() {
  const koa = createKoaApp()
  started = new Promise(resolve => {
    app = koa.app
    server = koa.server
    // startup includes automation runner - if enabled
    startup({ app, server }).then(resolve)
  })
  await started
}

start().catch(err => {
  console.error(`Failed server startup - ${err.message}`)
  throw err
})

export async function getServer(): Promise<Server> {
  await started
  return server
}
