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

export function created(automation: Automation) {
  const properties: AutomationCreatedEvent = {}
  publishEvent(Event.AUTOMATION_CREATED, properties)
}

export function deleted(automation: Automation) {
  const properties: AutomationDeletedEvent = {}
  publishEvent(Event.AUTOMATION_DELETED, properties)
}

export function tested(automation: Automation) {
  const properties: AutomationTestedEvent = {}
  publishEvent(Event.AUTOMATION_TESTED, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.AUTOMATION_RUN, properties)
// }

export function stepCreated(automation: Automation, step: AutomationStep) {
  const properties: AutomationStepCreatedEvent = {}
  publishEvent(Event.AUTOMATION_STEP_CREATED, properties)
}

export function stepDeleted(automation: Automation, step: AutomationStep) {
  const properties: AutomationStepDeletedEvent = {}
  publishEvent(Event.AUTOMATION_STEP_DELETED, properties)
}

export function triggerUpdated(
  automation: Automation,
  trigger: AutomationTrigger
) {
  const properties: AutomationTriggerUpdatedEvent = {}
  publishEvent(Event.AUTOMATION_TRIGGER_UPDATED, properties)
}
