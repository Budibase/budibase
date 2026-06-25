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
  data: "var(--automation-step-icon-data-color)",
  flowLogic: "var(--automation-step-icon-flow-logic-color)",
  code: "var(--automation-step-icon-code-color)",
  email: "var(--automation-step-icon-email-color)",
  ai: "var(--automation-step-icon-ai-color)",
  apps: "var(--automation-step-icon-apps-color)",
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
  AutomationActionStepId.MERGE,
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
  if (
    stepId &&
    Object.values(AutomationTriggerStepId).includes(
      stepId as AutomationTriggerStepId
    )
  ) {
    return "flowLogic"
  }
  if (stepId === AutomationActionStepId.SEND_EMAIL_SMTP) {
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
