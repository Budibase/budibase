const TestConfig = require("../../../tests/utilities/TestConfiguration")
const actions = require("../../actions")
const logic = require("../../logic")
const emitter = require("../../../events/index")

let config

exports.getConfig = () => {
  if (!config) {
    config = new TestConfig(false)
  }
  return config
}

exports.afterAll = () => {
  config.end()
}

exports.runStep = async function runStep(stepId, inputs) {
  let step
  if (
    Object.values(exports.actions)
      .map(action => action.stepId)
      .includes(stepId)
  ) {
    step = await actions.getAction(stepId)
  } else {
    step = logic.getLogic(stepId)
  }
  expect(step).toBeDefined()
  return step({
    inputs,
    appId: config ? config.getAppId() : null,
    // don't really need an API key, mocked out usage quota, not being tested here
    apiKey: exports.apiKey,
    emitter,
  })
}

exports.apiKey = "test"

exports.actions = actions.BUILTIN_DEFINITIONS
exports.logic = logic.BUILTIN_DEFINITIONS
