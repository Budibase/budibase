import { Document } from "../document"

export enum AutomationTriggerStepId {
  ROW_SAVED = "ROW_SAVED",
  ROW_UPDATED = "ROW_UPDATED",
  ROW_DELETED = "ROW_DELETED",
  WEBHOOK = "WEBHOOK",
  APP = "APP",
  CRON = "CRON",
}

export enum AutomationActionStepId {
  SEND_EMAIL_SMTP = "SEND_EMAIL_SMTP",
  CREATE_ROW = "CREATE_ROW",
  UPDATE_ROW = "UPDATE_ROW",
  DELETE_ROW = "DELETE_ROW",
  OUTGOING_WEBHOOK = "OUTGOING_WEBHOOK",
  EXECUTE_SCRIPT = "EXECUTE_SCRIPT",
  EXECUTE_QUERY = "EXECUTE_QUERY",
  SERVER_LOG = "SERVER_LOG",
  DELAY = "DELAY",
  FILTER = "FILTER",
  QUERY_ROWS = "QUERY_ROWS",
  LOOP = "LOOP",
  // these used to be lowercase step IDs, maintain for backwards compat
  discord = "discord",
  slack = "slack",
  zapier = "zapier",
  integromat = "integromat",
}

export interface Automation extends Document {
  definition: {
    steps: AutomationStep[]
    trigger: AutomationTrigger
  }
  appId: string
  name: string
}

export interface AutomationStep {
  id: string
  stepId: AutomationTriggerStepId | AutomationActionStepId
  inputs: {
    [key: string]: any
  }
  schema: {
    inputs: {
      [key: string]: any
    }
    outputs: {
      [key: string]: any
    }
  }
}

export interface AutomationTrigger extends AutomationStep {
  cronJobId?: string
}

export enum AutomationStatus {
  SUCCESS = "success",
  ERROR = "error",
  STOPPED = "stopped",
  STOPPED_ERROR = "stopped_error",
}

export interface AutomationResults {
  automationId?: string
  status?: AutomationStatus
  trigger?: any
  steps: {
    stepId: AutomationTriggerStepId | AutomationActionStepId
    inputs: {
      [key: string]: any
    }
    outputs: {
      [key: string]: any
    }
  }[]
}

export interface AutomationLog extends AutomationResults, Document {
  automationName: string
  _rev?: string
}

export interface AutomationLogPage {
  data: AutomationLog[]
  hasNextPage: boolean
  nextPage?: string
}
