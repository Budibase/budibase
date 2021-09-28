const actions = require("./actions")
const automationUtils = require("./automationUtils")
const AutomationEmitter = require("../events/AutomationEmitter")
const { processObject } = require("@budibase/string-templates")
const { DEFAULT_TENANT_ID } = require("@budibase/auth").constants
const CouchDB = require("../db")
const { DocumentTypes, isDevAppID } = require("../db/utils")
const { doInTenant } = require("@budibase/auth/tenancy")
const env = require("../environment")
const usage = require("../utilities/usageQuota")

const FILTER_STEP_ID = actions.ACTION_DEFINITIONS.FILTER.stepId

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
    const triggerStepId = automation.definition.trigger.stepId
    const triggerId = automation.definition.trigger.id
    this.updateExecutionOutput(triggerId, triggerStepId, null, triggerOutput)
  }

  async getStepFunctionality(stepId) {
    let step = await actions.getAction(stepId)
    if (step == null) {
      throw `Cannot find automation step by name ${stepId}`
    }
    return step
  }

  async getApp() {
    const appId = this._appId
    if (this._app) {
      return this._app
    }
    const db = new CouchDB(appId)
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
    for (let step of automation.definition.steps) {
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
        if (step.stepId === FILTER_STEP_ID && !outputs.success) {
          break
        }
        this._context.steps.push(outputs)
        this.updateExecutionOutput(step.id, step.stepId, step.inputs, outputs)
      } catch (err) {
        console.error(`Automation error - ${step.stepId} - ${err}`)
        return err
      }
    }

    // Increment quota for automation runs
    if (!env.SELF_HOSTED && !isDevAppID(this._appId)) {
      usage.update(usage.Properties.AUTOMATION, 1)
    }
    return this.executionOutput
  }
}

module.exports = async job => {
  const automationOrchestrator = new Orchestrator(
    job.data.automation,
    job.data.event
  )
  return automationOrchestrator.execute()
}
