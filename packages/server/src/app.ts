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

let app: Koa, server: Server

async function start() {
  const koa = createKoaApp()
  app = koa.app
  server = koa.server
  try {
    await startup({ app, server })
  } catch (err: any) {
    console.error(`Failed server startup - ${err.message}`)
    process.exit(1)
  }
}

start()

export function getServer(): Server {
  return server
}
