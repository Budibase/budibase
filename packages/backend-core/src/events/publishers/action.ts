import { publishEvent } from "../events"
import {
  Event,
  ActionAutomationStepExecuted,
  ActionAutomationStepFailed,
  ActionCrudExecuted,
  ActionCrudFailed,
  ActionAiAgentExecuted,
  ActionAiAgentFailed,
  ActionAiAgentToolExecuted,
  ActionAiAgentToolFailed,
} from "@budibase/types"

function automationStepExecuted(
  action: ActionAutomationStepExecuted,
  timestamp?: string | number
) {
  publishEvent(Event.ACTION_AUTOMATION_STEP_EXECUTED, action, timestamp).catch(
    err => {
      console.error("automationStepExecuted telemetry failed", { action, err })
    }
  )
}

function automationStepFailed(action: ActionAutomationStepFailed) {
  publishEvent(Event.ACTION_AUTOMATION_STEP_FAILED, action).catch(err => {
    console.error("automationStepFailed telemetry failed", { action, err })
  })
}

function crudExecuted(action: ActionCrudExecuted, timestamp?: string | number) {
  publishEvent(Event.ACTION_CRUD_EXECUTED, action, timestamp).catch(err => {
    console.error("crudExecuted telemetry failed", { action, err })
  })
}

function crudFailed(action: ActionCrudFailed) {
  publishEvent(Event.ACTION_CRUD_FAILED, action).catch(err => {
    console.error("crudFailed telemetry failed", { action, err })
  })
}

function aiAgentExecuted(
  action: ActionAiAgentExecuted,
  timestamp?: string | number
) {
  publishEvent(Event.ACTION_AI_AGENT_EXECUTED, action, timestamp).catch(err => {
    console.error("aiAgentExecuted telemetry failed", { action, err })
  })
}

function aiAgentFailed(
  action: ActionAiAgentFailed,
  timestamp?: string | number
) {
  publishEvent(Event.ACTION_AI_AGENT_FAILED, action, timestamp).catch(err => {
    console.error("aiAgentFailed telemetry failed", { action, err })
  })
}

function aiAgentToolExecuted(
  action: ActionAiAgentToolExecuted,
  timestamp?: string | number
) {
  publishEvent(Event.ACTION_AI_AGENT_TOOL_EXECUTED, action, timestamp).catch(
    err => {
      console.error("aiAgentToolExecuted telemetry failed", { action, err })
    }
  )
}

function aiAgentToolFailed(action: ActionAiAgentToolFailed) {
  publishEvent(Event.ACTION_AI_AGENT_TOOL_FAILED, action).catch(err => {
    console.error("aiAgentToolFailed telemetry failed", { action, err })
  })
}

export default {
  aiAgentExecuted,
  aiAgentFailed,
  aiAgentToolExecuted,
  aiAgentToolFailed,
  automationStepExecuted,
  automationStepFailed,
  crudExecuted,
  crudFailed,
}
