import { QueryVariable } from "./definitions"
import env from "../environment"
import * as db from "../db"
import { redis, db as dbCore } from "@budibase/backend-core"
import * as jsRunner from "../jsRunner"

const VARIABLE_TTL_SECONDS = 3600
let client: redis.Client | null = null

async function getClient() {
  if (!client) {
    client = await new redis.Client(redis.utils.Databases.QUERY_VARS).init()
  }
  return client
}

process.on("exit", async () => {
  if (client) {
    await client.finish()
  }
})

function makeVariableKey(queryId: string, variable: string) {
  return `${queryId}${dbCore.SEPARATOR}${variable}`
}

export function threadSetup() {
  // don't run this if not threading
  if (env.isTest() || env.DISABLE_THREADING || !env.isInThread()) {
    console.debug(`[${env.FORKED_PROCESS_NAME}] thread setup skipped`)
    return
  }

  console.debug(`[${env.FORKED_PROCESS_NAME}] thread setup running`)
  jsRunner.init()
  db.init()
}

export async function getCachedVariable(queryId: string, variable: string) {
  return (await getClient()).get(makeVariableKey(queryId, variable))
}

export async function invalidateCachedVariable(vars: QueryVariable[]) {
  const cache = await getClient()
  await Promise.all(
    vars.map(v => cache.delete(makeVariableKey(v.queryId, v.name)))
  )
}

export async function storeDynamicVariable(
  queryId: string,
  variable: string,
  value: any
) {
  const cache = await getClient()
  await cache.store(
    makeVariableKey(queryId, variable),
    value,
    VARIABLE_TTL_SECONDS
  )
}

export function formatResponse(resp: any) {
  if (typeof resp === "string") {
    try {
      resp = JSON.parse(resp)
    } catch (err) {
      resp = { response: resp }
    }
  }
  return resp
}

export function hasExtraData(response: any) {
  return (
    typeof response === "object" &&
    !Array.isArray(response) &&
    response &&
    response.data != null &&
    response.info != null
  )
}

export default {
  hasExtraData,
  formatResponse,
  storeDynamicVariable,
  invalidateCachedVariable,
  getCachedVariable,
  threadSetup,
}
