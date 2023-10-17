import { QueryVariable } from "./definitions"
import env from "../environment"
import * as db from "../db"
import { redis, db as dbCore } from "@budibase/backend-core"

const VARIABLE_TTL_SECONDS = 3600
let client: any

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
  db.init()
}

export async function checkCacheForDynamicVariable(
  queryId: string,
  variable: string
) {
  const cache = await getClient()
  return cache.get(makeVariableKey(queryId, variable))
}

export async function invalidateDynamicVariables(cachedVars: QueryVariable[]) {
  const cache = await getClient()
  let promises = []
  for (let variable of cachedVars) {
    promises.push(
      cache.delete(makeVariableKey(variable.queryId, variable.name))
    )
  }
  await Promise.all(promises)
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
  invalidateDynamicVariables,
  checkCacheForDynamicVariable,
  threadSetup,
}
