require("./utils").threadSetup()
const actions = require("../automations/actions")
const automationUtils = require("../automations/automationUtils")
const AutomationEmitter = require("../events/AutomationEmitter")
const { processObject } = require("@budibase/string-templates")
const { DEFAULT_TENANT_ID } = require("@budibase/backend-core/constants")
const { DocumentTypes } = require("../db/utils")
const { doInTenant } = require("@budibase/backend-core/tenancy")
const { definitions: triggerDefs } = require("../automations/triggerInfo")
const { doInAppContext, getAppDB } = require("@budibase/backend-core/context")

const FILTER_STEP_ID = actions.ACTION_DEFINITIONS.FILTER.stepId
const CRON_STEP_ID = triggerDefs.CRON.stepId
const STOPPED_STATUS = { success: false, status: "STOPPED" }

/**
 * The automation orchestrator is a class responsible for executing automations.
 * It handles the context of the automation and makes sure each step gets the correct
 * inputs and handles any outputs.
 */
class Orchestrator {
  constructor(automation, triggerOutput = {}) {
    this._metadata = triggerOutput.metadata
    this._chainCount = this._metadata ? this._metadata.automationChainCount : 0
    this._appId = triggerOutput.appId
    this._app = null
    const triggerStepId = automation.definition.trigger.stepId
    triggerOutput = this.cleanupTriggerOutputs(triggerStepId, triggerOutput)
    // remove from context
    delete triggerOutput.appId
    delete triggerOutput.metadata
    // step zero is never used as the template string is zero indexed for customer facing
    this._context = { steps: [{}], trigger: triggerOutput }
    this._automation = automation
    // create an emitter which has the chain count for this automation run in it, so it can block
    // excessive chaining if required
    this._emitter = new AutomationEmitter(this._chainCount + 1)
    this.executionOutput = { trigger: {}, steps: [] }
    // setup the execution output
    const triggerId = automation.definition.trigger.id
    this.updateExecutionOutput(triggerId, triggerStepId, null, triggerOutput)
  }

  cleanupTriggerOutputs(stepId, triggerOutput) {
    if (stepId === CRON_STEP_ID) {
      triggerOutput.timestamp = Date.now()
    }
    return triggerOutput
  }

  async getStepFunctionality(stepId) {
    let step = await actions.getAction(stepId)
    if (step == null) {
      throw `Cannot find automation step by name ${stepId}`
    }
    return step
  }

  async getApp() {
    if (this._app) {
      return this._app
    }
    const db = getAppDB()
    this._app = await db.get(DocumentTypes.APP_METADATA)
    return this._app
  }

  updateExecutionOutput(id, stepId, inputs, outputs) {
    const stepObj = { id, stepId, inputs, outputs }
    // first entry is always the trigger (constructor)
    if (this.executionOutput.steps.length === 0) {
      this.executionOutput.trigger = stepObj
    }
    this.executionOutput.steps.push(stepObj)
  }

  async execute() {
    let automation = this._automation
    const app = await this.getApp()
    let stopped = false
    for (let step of automation.definition.steps) {
      // execution stopped, record state for that
      if (stopped) {
        this.updateExecutionOutput(step.id, step.stepId, {}, STOPPED_STATUS)
        continue
      }
      let stepFn = await this.getStepFunctionality(step.stepId)
      step.inputs = await processObject(step.inputs, this._context)
      step.inputs = automationUtils.cleanInputValues(
        step.inputs,
        step.schema.inputs
      )
      // appId is always passed
      try {
        let tenantId = app.tenantId || DEFAULT_TENANT_ID
        const outputs = await doInTenant(tenantId, () => {
          return stepFn({
            inputs: step.inputs,
            appId: this._appId,
            emitter: this._emitter,
            context: this._context,
          })
        })
        this._context.steps.push(outputs)
        // if filter causes us to stop execution don't break the loop, set a var
        // so that we can finish iterating through the steps and record that it stopped
        if (step.stepId === FILTER_STEP_ID && !outputs.success) {
          stopped = true
          this.updateExecutionOutput(step.id, step.stepId, step.inputs, {
            ...outputs,
            ...STOPPED_STATUS,
          })
          continue
        }
        this.updateExecutionOutput(step.id, step.stepId, step.inputs, outputs)
      } catch (err) {
        console.error(`Automation error - ${step.stepId} - ${err}`)
        return err
      }
    }
    return this.executionOutput
  }
}

module.exports = (input, callback) => {
  const appId = input.data.event.appId
  doInAppContext(appId, () => {
    const automationOrchestrator = new Orchestrator(
      input.data.automation,
      input.data.event
    )
    automationOrchestrator
      .execute()
      .then(response => {
        callback(null, response)
      })
      .catch(err => {
        callback(err)
      })
  })
}
