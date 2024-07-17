import { context, events, HTTPError } from "@budibase/backend-core"
import { Automation } from "@budibase/types"
import { checkForWebhooks } from "src/automations/utils"
import { MetadataTypes } from "src/constants"
import { generateAutomationID, getAutomationParams } from "src/db/utils"
import { deleteEntityMetadata } from "src/utilities"

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

async function handleStepEvents(
  oldAutomation: Automation,
  automation: Automation
) {
  const getNewSteps = (oldAutomation: Automation, automation: Automation) => {
    const oldStepIds = oldAutomation.definition.steps.map(s => s.id)
    return automation.definition.steps.filter(s => !oldStepIds.includes(s.id))
  }

  const getDeletedSteps = (
    oldAutomation: Automation,
    automation: Automation
  ) => {
    const stepIds = automation.definition.steps.map(s => s.id)
    return oldAutomation.definition.steps.filter(s => !stepIds.includes(s.id))
  }

  // new steps
  const newSteps = getNewSteps(oldAutomation, automation)
  for (let step of newSteps) {
    await events.automation.stepCreated(automation, step)
  }

  // old steps
  const deletedSteps = getDeletedSteps(oldAutomation, automation)
  for (let step of deletedSteps) {
    await events.automation.stepDeleted(automation, step)
  }
}

export async function fetch() {
  const db = getDb()
  const response = await db.allDocs<Automation>(
    getAutomationParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}

export async function get(automationId: string) {
  const db = getDb()
  const result = await db.get<Automation>(automationId)
  return result
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

export async function update(automation: Automation) {
  automation = { ...automation }

  if (!automation._id || !automation._rev) {
    throw new HTTPError("_id or _rev fields missing", 400)
  }

  const db = getDb()

  const oldAutomation = await db.get<Automation>(automation._id)
  automation = cleanAutomationInputs(automation)
  automation = await checkForWebhooks({
    oldAuto: oldAutomation,
    newAuto: automation,
  })
  const response = await db.put(automation)
  automation._rev = response.rev

  const oldAutoTrigger =
    oldAutomation && oldAutomation.definition.trigger
      ? oldAutomation.definition.trigger
      : undefined
  const newAutoTrigger =
    automation && automation.definition.trigger
      ? automation.definition.trigger
      : undefined
  // trigger has been updated, remove the test inputs
  if (oldAutoTrigger && oldAutoTrigger.id !== newAutoTrigger?.id) {
    await events.automation.triggerUpdated(automation)
    await deleteEntityMetadata(
      MetadataTypes.AUTOMATION_TEST_INPUT,
      automation._id!
    )
  }

  await handleStepEvents(oldAutomation, automation)

  return {
    ...automation,
    _rev: response.rev,
    _id: response.id,
  }
}

export async function remove(automationId: string, rev: string) {
  const db = getDb()
  const existing = await db.get<Automation>(automationId)
  await checkForWebhooks({
    oldAuto: existing,
  })

  // delete metadata first
  await deleteEntityMetadata(MetadataTypes.AUTOMATION_TEST_INPUT, automationId)
  await deleteEntityMetadata(
    MetadataTypes.AUTOMATION_TEST_HISTORY,
    automationId
  )

  const result = await db.remove(automationId, rev)

  await events.automation.deleted(existing)

  return result
}
