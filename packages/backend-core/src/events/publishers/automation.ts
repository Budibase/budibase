import { publishEvent } from "../events"
import {
  Automation,
  Event,
  AutomationStep,
  AutomationCreatedEvent,
  AutomationDeletedEvent,
  AutomationTestedEvent,
  AutomationStepCreatedEvent,
  AutomationStepDeletedEvent,
  AutomationTriggerUpdatedEvent,
  AutomationsRunEvent,
} from "@budibase/types"

async function created(automation: Automation, timestamp?: string | number) {
  const properties: AutomationCreatedEvent = {
    appId: automation.appId,
    automationId: automation._id as string,
    triggerId: automation.definition?.trigger?.id,
    triggerType: automation.definition?.trigger?.stepId,
    audited: {
      name: automation.name,
    },
  }
  await publishEvent(Event.AUTOMATION_CREATED, properties, timestamp)
}

async function triggerUpdated(automation: Automation) {
  const properties: AutomationTriggerUpdatedEvent = {
    appId: automation.appId,
    automationId: automation._id as string,
    triggerId: automation.definition?.trigger?.id,
    triggerType: automation.definition?.trigger?.stepId,
  }
  await publishEvent(Event.AUTOMATION_TRIGGER_UPDATED, properties)
}

async function deleted(automation: Automation) {
  const properties: AutomationDeletedEvent = {
    appId: automation.appId,
    automationId: automation._id as string,
    triggerId: automation.definition?.trigger?.id,
    triggerType: automation.definition?.trigger?.stepId,
    audited: {
      name: automation.name,
    },
  }
  await publishEvent(Event.AUTOMATION_DELETED, properties)
}

async function tested(automation: Automation) {
  const properties: AutomationTestedEvent = {
    appId: automation.appId,
    automationId: automation._id as string,
    triggerId: automation.definition?.trigger?.id,
    triggerType: automation.definition?.trigger?.stepId,
  }
  await publishEvent(Event.AUTOMATION_TESTED, properties)
}

const run = async (count: number, timestamp?: string | number) => {
  const properties: AutomationsRunEvent = {
    count,
  }
  await publishEvent(Event.AUTOMATIONS_RUN, properties, timestamp)
}

async function stepCreated(
  automation: Automation,
  step: AutomationStep,
  timestamp?: string | number
) {
  const properties: AutomationStepCreatedEvent = {
    appId: automation.appId,
    automationId: automation._id as string,
    triggerId: automation.definition?.trigger?.id,
    triggerType: automation.definition?.trigger?.stepId,
    stepId: step.id!,
    stepType: step.stepId,
    audited: {
      name: automation.name,
    },
  }
  await publishEvent(Event.AUTOMATION_STEP_CREATED, properties, timestamp)
}

async function stepDeleted(automation: Automation, step: AutomationStep) {
  const properties: AutomationStepDeletedEvent = {
    appId: automation.appId,
    automationId: automation._id as string,
    triggerId: automation.definition?.trigger?.id,
    triggerType: automation.definition?.trigger?.stepId,
    stepId: step.id!,
    stepType: step.stepId,
    audited: {
      name: automation.name,
    },
  }
  await publishEvent(Event.AUTOMATION_STEP_DELETED, properties)
}

export default {
  created,
  triggerUpdated,
  deleted,
  tested,
  run,
  stepCreated,
  stepDeleted,
}
