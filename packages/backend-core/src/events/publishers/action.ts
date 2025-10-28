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
  console.info(
    Event.ACTION_AUTOMATION_STEP_EXECUTED,
    `disabled. Action step ${action.stepId} not published at ${timestamp}`
  )
  // TODO enable event publish -> https://github.com/Budibase/account-portal/issues/1639
  //await publishEvent(Event.ACTION_AUTOMATION_STEP_EXECUTED, action, timestamp)
}

async function crudExecuted(
  action: ActionCrudExecuted,
  timestamp?: string | number
) {
  console.info(
    Event.ACTION_AUTOMATION_STEP_EXECUTED,
    `disabled. Action type ${action.type} not published at ${timestamp}`
  )
  // TODO enable event publish -> https://github.com/Budibase/account-portal/issues/1639
  //await publishEvent(Event.ACTION_CRUD_EXECUTED, action, timestamp)
}

async function aiAgentExecuted(
  action: ActionAiAgentExecuted,
  timestamp?: string | number
) {
  console.info(
    Event.ACTION_AUTOMATION_STEP_EXECUTED,
    `disabled. Execution for ai agent ${action.agentId} not published at ${timestamp}`
  )
  // TODO enable event publish -> https://github.com/Budibase/account-portal/issues/1639
  //await publishEvent(Event.ACTION_AI_AGENT_EXECUTED, action, timestamp)
}

export default {
  aiAgentExecuted,
  automationStepExecuted,
  crudExecuted,
}
