import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { BUILTIN_ACTION_DEFINITIONS } from "../../actions"
import env from "../../../environment"
import { AutomationData, Datasource } from "@budibase/types"
import { Knex } from "knex"
import { getQueue } from "../.."
import { Job } from "bull"
import { helpers } from "@budibase/shared-core"

let config: TestConfiguration

export function getConfig(): TestConfiguration {
  if (!config) {
    config = new TestConfiguration(true)
  }
  return config
}

export function afterAll() {
  config.end()
}

export async function runInProd(fn: any) {
  env._set("NODE_ENV", "production")
  let error
  try {
    await fn()
  } catch (err) {
    error = err
  }
  env._set("NODE_ENV", "jest")
  if (error) {
    throw error
  }
}

/**
 * Capture all automation runs that occur during the execution of a function.
 * This function will wait for all messages to be processed before returning.
 */
export async function captureAutomationRuns(
  f: () => Promise<unknown>
): Promise<Job<AutomationData>[]> {
  const runs: Job<AutomationData>[] = []
  const queue = getQueue()
  let messagesReceived = 0

  const completedListener = async (job: Job<AutomationData>) => {
    runs.push(job)
    messagesReceived--
  }
  const messageListener = async () => {
    messagesReceived++
  }
  queue.on("message", messageListener)
  queue.on("completed", completedListener)
  try {
    await f()
    // Queue messages tend to be send asynchronously in API handlers, so there's
    // no guarantee that awaiting this function will have queued anything yet.
    // We wait here to make sure we're queued _after_ any existing async work.
    await helpers.wait(100)
  } finally {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (messagesReceived > 0) {
      await helpers.wait(50)
    }
    queue.off("completed", completedListener)
    queue.off("message", messageListener)
  }

  return runs
}

export async function saveTestQuery(
  config: TestConfiguration,
  client: Knex,
  tableName: string,
  datasource: Datasource
) {
  return await config.api.query.save({
    name: "test query",
    datasourceId: datasource._id!,
    parameters: [],
    fields: {
      sql: client(tableName).select("*").toSQL().toNative().sql,
    },
    transformer: "",
    schema: {},
    readable: true,
    queryVerb: "read",
  })
}

export const apiKey = "test"
export const actions = BUILTIN_ACTION_DEFINITIONS
