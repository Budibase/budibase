import TestConfig from "../../../tests/utilities/TestConfiguration"
import { BUILTIN_ACTION_DEFINITIONS, getAction } from "../../actions"
import emitter from "../../../events/index"

let config: TestConfig

export function getConfig(): TestConfig {
  if (!config) {
    config = new TestConfig(true)
  }
  return config
}

export function afterAll() {
  config.end()
}

export async function runStep(
  config: TestConfig,
  stepId: string,
  inputs: any,
  stepContext?: any
) {
  async function run() {
    let step = await getAction(stepId)
    expect(step).toBeDefined()
    if (!step) {
      throw new Error("No step found")
    }
    return step({
      context: stepContext || {},
      inputs,
      appId: config.getAppId(),
      // don't really need an API key, mocked out usage quota, not being tested here
      apiKey: "test",
      emitter,
    })
  }
  return run()
}

export const actions = BUILTIN_ACTION_DEFINITIONS
