import { publishEvent } from "../events"
import {
  Event,
  ActionAutomationStepExecuted,
  ActionCrudExecuted,
  ActionAiAgentExecuted,
} from "@budibase/types"

async function automationStepExecuted(
  action: ActionAutomationStepExecuted,
  timestamp?: string | number
) {
  await publishEvent(Event.ACTION_AUTOMATION_STEP_EXECUTED, action, timestamp)
}

async function crudExecuted(
  action: ActionCrudExecuted,
  timestamp?: string | number
) {
  await publishEvent(Event.ACTION_CRUD_EXECUTED, action, timestamp)
}

async function aiAgentExecuted(
  action: ActionAiAgentExecuted,
  timestamp?: string | number
) {
  await publishEvent(Event.ACTION_AI_AGENT_EXECUTED, action, timestamp)
}

export default {
  aiAgentExecuted,
  automationStepExecuted,
  crudExecuted,
}
