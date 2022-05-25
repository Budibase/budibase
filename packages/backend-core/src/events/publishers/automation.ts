import { publishEvent } from "../events"
import {
  Automation,
  Event,
  AutomationStep,
  AutomationTrigger,
  AutomationCreatedEvent,
  AutomationDeletedEvent,
  AutomationTestedEvent,
  AutomationStepCreatedEvent,
  AutomationStepDeletedEvent,
  AutomationTriggerUpdatedEvent,
} from "@budibase/types"

export async function created(automation: Automation, timestamp?: string) {
  const properties: AutomationCreatedEvent = {}
  await publishEvent(Event.AUTOMATION_CREATED, properties, timestamp)
}

export async function deleted(automation: Automation) {
  const properties: AutomationDeletedEvent = {}
  await publishEvent(Event.AUTOMATION_DELETED, properties)
}

export async function tested(automation: Automation) {
  const properties: AutomationTestedEvent = {}
  await publishEvent(Event.AUTOMATION_TESTED, properties)
}

export async function stepCreated(
  automation: Automation,
  step: AutomationStep,
  timestamp?: string
) {
  const properties: AutomationStepCreatedEvent = {}
  await publishEvent(Event.AUTOMATION_STEP_CREATED, properties, timestamp)
}

export async function stepDeleted(
  automation: Automation,
  step: AutomationStep
) {
  const properties: AutomationStepDeletedEvent = {}
  await publishEvent(Event.AUTOMATION_STEP_DELETED, properties)
}

export async function triggerUpdated(
  automation: Automation,
  trigger: AutomationTrigger
) {
  const properties: AutomationTriggerUpdatedEvent = {}
  await publishEvent(Event.AUTOMATION_TRIGGER_UPDATED, properties)
}
