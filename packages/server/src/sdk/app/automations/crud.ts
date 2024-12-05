import {
  Automation,
  RequiredKeys,
  Webhook,
  WebhookActionType,
  MetadataType,
} from "@budibase/types"
import { generateAutomationID, getAutomationParams } from "../../../db/utils"
import { deleteEntityMetadata } from "../../../utilities"
import {
  context,
  events,
  HTTPError,
  db as dbCore,
} from "@budibase/backend-core"
import { definitions } from "../../../automations/triggerInfo"
import automations from "."

export interface PersistedAutomation extends Automation {
  _id: string
  _rev: string
}

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
  const response = await db.allDocs<PersistedAutomation>(
    getAutomationParams(null, {
      include_docs: true,
    })
  )
  const automations: PersistedAutomation[] = response.rows
    .filter(row => !!row.doc)
    .map(row => row.doc!)
  return automations.map(trimUnexpectedObjectFields)
}

export async function get(automationId: string) {
  const db = getDb()
  const result = await db.get<PersistedAutomation>(automationId)
  return trimUnexpectedObjectFields(result)
}

export async function find(ids: string[]) {
  const db = getDb()
  const result = await db.getMultiple<PersistedAutomation>(ids)
  return result.map(trimUnexpectedObjectFields)
}

export async function create(automation: Automation) {
  automation = trimUnexpectedObjectFields(automation)
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
  automation = trimUnexpectedObjectFields(automation)
  if (!automation._id || !automation._rev) {
    throw new HTTPError("_id or _rev fields missing", 400)
  }

  const db = getDb()

  const oldAutomation = await db.get<Automation>(automation._id)

  guardInvalidUpdatesAndThrow(automation, oldAutomation)

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
      MetadataType.AUTOMATION_TEST_INPUT,
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
  await deleteEntityMetadata(MetadataType.AUTOMATION_TEST_INPUT, automationId)
  await deleteEntityMetadata(MetadataType.AUTOMATION_TEST_HISTORY, automationId)

  const result = await db.remove(automationId, rev)

  await events.automation.deleted(existing)

  return result
}

/**
 * This function handles checking if any webhooks need to be created or deleted for automations.
 * @param appId The ID of the app in which we are checking for webhooks
 * @param oldAuto The old automation object if updating/deleting
 * @param newAuto The new automation object if creating/updating
 * @returns After this is complete the new automation object may have been updated and should be
 * written to DB (this does not write to DB as it would be wasteful to repeat).
 */
async function checkForWebhooks({ oldAuto, newAuto }: any) {
  const WH_STEP_ID = definitions.WEBHOOK.stepId

  const appId = context.getAppId()
  if (!appId) {
    throw new Error("Unable to check webhooks - no app ID in context.")
  }
  const oldTrigger = oldAuto ? oldAuto.definition.trigger : null
  const newTrigger = newAuto ? newAuto.definition.trigger : null
  const triggerChanged =
    oldTrigger && newTrigger && oldTrigger.id !== newTrigger.id
  function isWebhookTrigger(auto: any) {
    return (
      auto &&
      auto.definition.trigger &&
      auto.definition.trigger.stepId === WH_STEP_ID
    )
  }
  // need to delete webhook
  if (
    isWebhookTrigger(oldAuto) &&
    (!isWebhookTrigger(newAuto) || triggerChanged) &&
    oldTrigger.webhookId
  ) {
    try {
      const db = getDb()
      // need to get the webhook to get the rev
      const webhook = await db.get<Webhook>(oldTrigger.webhookId)
      // might be updating - reset the inputs to remove the URLs
      if (newTrigger) {
        delete newTrigger.webhookId
        newTrigger.inputs = {}
      }
      await automations.webhook.destroy(webhook._id!, webhook._rev!)
    } catch (err) {
      // don't worry about not being able to delete, if it doesn't exist all good
    }
  }
  // need to create webhook
  if (
    (!isWebhookTrigger(oldAuto) || triggerChanged) &&
    isWebhookTrigger(newAuto)
  ) {
    const webhook = await automations.webhook.save(
      automations.webhook.newDoc(
        "Automation webhook",
        WebhookActionType.AUTOMATION,
        newAuto._id
      )
    )
    const id = webhook._id
    newTrigger.webhookId = id
    // the app ID has to be development for this endpoint
    // it can only be used when building the app
    // but the trigger endpoint will always be used in production
    const prodAppId = dbCore.getProdAppID(appId)
    newTrigger.inputs = {
      schemaUrl: `api/webhooks/schema/${appId}/${id}`,
      triggerUrl: `api/webhooks/trigger/${prodAppId}/${id}`,
    }
  }
  return newAuto
}

function guardInvalidUpdatesAndThrow(
  automation: Automation,
  oldAutomation: Automation
) {
  const stepDefinitions = [
    automation.definition.trigger,
    ...automation.definition.steps,
  ]
  const oldStepDefinitions = [
    oldAutomation.definition.trigger,
    ...oldAutomation.definition.steps,
  ]
  for (const step of stepDefinitions) {
    const readonlyFields = Object.keys(
      step.schema.inputs.properties || {}
    ).filter(k => step.schema.inputs.properties[k].readonly)
    readonlyFields.forEach(readonlyField => {
      const oldStep = oldStepDefinitions.find(i => i.id === step.id)
      if (step.inputs[readonlyField] !== oldStep?.inputs[readonlyField]) {
        throw new HTTPError(
          `Field ${readonlyField} is readonly and it cannot be modified`,
          400
        )
      }
    })
  }
}

function trimUnexpectedObjectFields<T extends Automation>(automation: T): T {
  // This will ensure all the automation fields (and nothing else) is mapped to the result
  const allRequired: RequiredKeys<Automation> = {
    _id: automation._id,
    _rev: automation._rev,
    definition: automation.definition,
    screenId: automation.screenId,
    uiTree: automation.uiTree,
    appId: automation.appId,
    live: automation.live,
    name: automation.name,
    internal: automation.internal,
    type: automation.type,
    disabled: automation.disabled,
    testData: automation.testData,
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
  }
  const result = { ...allRequired } as T
  for (const key in result) {
    if (!Object.prototype.hasOwnProperty.call(automation, key)) {
      delete result[key]
    }
  }
  return result as T
}
