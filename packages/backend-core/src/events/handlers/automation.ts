import { processEvent } from "../events"
import {
  Automation,
  Events,
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
  processEvent(Events.AUTOMATION_CREATED, properties)
}

export function deleted(automation: Automation) {
  const properties: AutomationDeletedEvent = {}
  processEvent(Events.AUTOMATION_DELETED, properties)
}

export function tested(automation: Automation) {
  const properties: AutomationTestedEvent = {}
  processEvent(Events.AUTOMATION_TESTED, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.AUTOMATION_RUN, properties)
// }

export function stepCreated(automation: Automation, step: AutomationStep) {
  const properties: AutomationStepCreatedEvent = {}
  processEvent(Events.AUTOMATION_STEP_CREATED, properties)
}

export function stepDeleted(automation: Automation, step: AutomationStep) {
  const properties: AutomationStepDeletedEvent = {}
  processEvent(Events.AUTOMATION_STEP_DELETED, properties)
}

export function triggerUpdated(
  automation: Automation,
  trigger: AutomationTrigger
) {
  const properties: AutomationTriggerUpdatedEvent = {}
  processEvent(Events.AUTOMATION_TRIGGER_UPDATED, properties)
}
