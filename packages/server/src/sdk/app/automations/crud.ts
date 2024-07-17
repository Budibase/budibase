import { context, events } from "@budibase/backend-core"
import { Automation } from "@budibase/types"
import { checkForWebhooks } from "src/automations/utils"
import { generateAutomationID } from "src/db/utils"

function getDb() {
  return context.getAppDB()
}

function cleanAutomationInputs(automation: Automation) {
  if (automation == null) {
    return automation
  }
  let steps = automation.definition.steps
  let trigger = automation.definition.trigger
  let allSteps = [...steps, trigger]
  // live is not a property used anymore
  if (automation.live != null) {
    delete automation.live
  }
  for (let step of allSteps) {
    if (step == null) {
      continue
    }
    for (let inputName of Object.keys(step.inputs)) {
      if (!step.inputs[inputName] || step.inputs[inputName] === "") {
        delete step.inputs[inputName]
      }
    }
  }
  return automation
}

export async function create(automation: Automation) {
  automation = { ...automation }
  const db = getDb()

  // Respect existing IDs if recreating a deleted automation
  if (!automation._id) {
    automation._id = generateAutomationID()
  }

  automation.type = "automation"
  automation = cleanAutomationInputs(automation)
  automation = await checkForWebhooks({
    newAuto: automation,
  })
  const response = await db.put(automation)
  await events.automation.created(automation)
  for (let step of automation.definition.steps) {
    await events.automation.stepCreated(automation, step)
  }
  automation._rev = response.rev
  automation._id = response.id

  return automation
}
