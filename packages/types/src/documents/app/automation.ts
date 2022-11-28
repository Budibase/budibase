import { Document } from "../document"
import { EventEmitter } from "events"

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
  EXECUTE_BASH = "EXECUTE_BASH",
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
  live?: boolean
  name: string
}

export interface AutomationStepSchema {
  name: string
  tagline: string
  icon: string
  description: string
  type: string
  internal?: boolean
  deprecated?: boolean
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
    required?: string[]
  }
}

export interface AutomationStep extends AutomationStepSchema {
  id: string
}

export interface AutomationTriggerSchema extends AutomationStepSchema {
  event?: string
  cronJobId?: string
}

export interface AutomationTrigger extends AutomationTriggerSchema {
  id: string
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

export type AutomationStepInput = {
  inputs: Record<string, any>
  context: Record<string, any>
  emitter: EventEmitter
  appId: string
  apiKey?: string
}
