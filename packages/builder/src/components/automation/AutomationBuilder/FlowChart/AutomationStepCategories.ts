import {
  AutomationActionStepId,
  AutomationTriggerStepId,
} from "@budibase/types"

type AutomationStepId =
  | AutomationActionStepId
  | AutomationTriggerStepId
  | string

type AutomationStepCategory =
  | "data"
  | "flowLogic"
  | "code"
  | "email"
  | "ai"
  | "apps"

const STEP_CATEGORY_COLORS: Record<AutomationStepCategory, string> = {
  data: "var(--color-blue-600)",
  flowLogic: "var(--color-purple-600)",
  code: "var(--color-orange-600)",
  email: "var(--color-green-600)",
  ai: "var(--color-brand-500)",
  apps: "var(--color-orange-400)",
}

const DATA_STEPS = new Set<AutomationStepId>([
  AutomationActionStepId.CREATE_ROW,
  AutomationActionStepId.GET_ROW,
  AutomationActionStepId.UPDATE_ROW,
  AutomationActionStepId.DELETE_ROW,
  AutomationActionStepId.QUERY_ROWS,
  AutomationActionStepId.API_REQUEST,
  AutomationActionStepId.EXECUTE_QUERY,
  AutomationTriggerStepId.ROW_SAVED,
  AutomationTriggerStepId.ROW_UPDATED,
  AutomationTriggerStepId.ROW_DELETED,
  AutomationTriggerStepId.ROW_ACTION,
])

const FLOW_LOGIC_STEPS = new Set<AutomationStepId>([
  AutomationActionStepId.FILTER,
  AutomationActionStepId.DELAY,
  AutomationActionStepId.BRANCH,
  AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
  AutomationActionStepId.COLLECT,
  AutomationActionStepId.LOOP,
  AutomationActionStepId.LOOP_V2,
  AutomationTriggerStepId.APP,
  AutomationTriggerStepId.CRON,
  AutomationTriggerStepId.WEBHOOK,
])

const CODE_STEPS = new Set<AutomationStepId>([
  AutomationActionStepId.EXECUTE_BASH,
  AutomationActionStepId.EXECUTE_SCRIPT,
  AutomationActionStepId.EXECUTE_SCRIPT_V2,
  AutomationActionStepId.SERVER_LOG,
  AutomationActionStepId.EXTRACT_STATE,
  AutomationActionStepId.OUTGOING_WEBHOOK,
])

const AI_STEPS = new Set<AutomationStepId>([
  AutomationActionStepId.AGENT,
  AutomationActionStepId.PROMPT_LLM,
  AutomationActionStepId.CLASSIFY_CONTENT,
  AutomationActionStepId.TRANSLATE,
  AutomationActionStepId.SUMMARISE,
  AutomationActionStepId.GENERATE_TEXT,
  AutomationActionStepId.EXTRACT_FILE_DATA,
])

const APP_STEPS = new Set<AutomationStepId>([
  AutomationActionStepId.OPENAI,
  AutomationActionStepId.zapier,
  AutomationActionStepId.n8n,
  AutomationActionStepId.integromat,
  AutomationActionStepId.discord,
  AutomationActionStepId.slack,
])

const getAutomationStepCategory = (
  stepId?: AutomationStepId
): AutomationStepCategory => {
  if (stepId === AutomationActionStepId.SEND_EMAIL_SMTP) {
    return "email"
  }
  if (stepId === AutomationTriggerStepId.EMAIL) {
    return "email"
  }
  if (stepId && DATA_STEPS.has(stepId)) {
    return "data"
  }
  if (stepId && FLOW_LOGIC_STEPS.has(stepId)) {
    return "flowLogic"
  }
  if (stepId && CODE_STEPS.has(stepId)) {
    return "code"
  }
  if (stepId && AI_STEPS.has(stepId)) {
    return "ai"
  }
  if (stepId && APP_STEPS.has(stepId)) {
    return "apps"
  }
  return "flowLogic"
}

export const getAutomationStepIconColor = (stepId?: AutomationStepId) => {
  return STEP_CATEGORY_COLORS[getAutomationStepCategory(stepId)]
}
