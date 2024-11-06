import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { context } from "@budibase/backend-core"
import { BUILTIN_ACTION_DEFINITIONS, getAction } from "../../actions"
import emitter from "../../../events/index"
import env from "../../../environment"
import { AutomationActionStepId, Datasource } from "@budibase/types"
import { Knex } from "knex"

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

export async function runStep(
  config: TestConfiguration,
  stepId: string,
  inputs: any,
  stepContext?: any
) {
  async function run() {
    let step = await getAction(stepId as AutomationActionStepId)
    expect(step).toBeDefined()
    if (!step) {
      throw new Error("No step found")
    }
    return step({
      context: stepContext || {},
      inputs,
      appId: config ? config.getAppId() : "",
      // don't really need an API key, mocked out usage quota, not being tested here
      apiKey,
      emitter,
    })
  }
  if (config.appId) {
    return context.doInContext(config?.appId, async () => {
      return run()
    })
  } else {
    return run()
  }
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
