import { Document } from "../../document"
import { EventEmitter } from "events"
import { User } from "../../global"
import { ReadStream } from "fs"
import { Row } from "../row"
import { Table } from "../table"
import { AutomationStep, AutomationTrigger } from "./schema"

export enum AutomationIOType {
  OBJECT = "object",
  STRING = "string",
  BOOLEAN = "boolean",
  NUMBER = "number",
  ARRAY = "array",
  JSON = "json",
  DATE = "date",
  ATTACHMENT = "attachment",
}

export enum AutomationCustomIOType {
  TABLE = "table",
  ROW = "row",
  ROWS = "rows",
  WIDE = "wide",
  QUERY = "query",
  QUERY_PARAMS = "queryParams",
  QUERY_LIMIT = "queryLimit",
  LOOP_OPTION = "loopOption",
  ITEM = "item",
  CODE = "code",
  FILTERS = "filters",
  COLUMN = "column",
  TRIGGER_SCHEMA = "triggerSchema",
  CRON = "cron",
  WEBHOOK_URL = "webhookUrl",
  AUTOMATION = "automation",
  AUTOMATION_FIELDS = "automationFields",
  MULTI_ATTACHMENTS = "multi_attachments",
  TRIGGER_FILTER = "trigger_filter",
}

export enum AutomationTriggerStepId {
  ROW_SAVED = "ROW_SAVED",
  ROW_UPDATED = "ROW_UPDATED",
  ROW_DELETED = "ROW_DELETED",
  WEBHOOK = "WEBHOOK",
  APP = "APP",
  CRON = "CRON",
  ROW_ACTION = "ROW_ACTION",
}

export enum AutomationStepType {
  LOGIC = "LOGIC",
  ACTION = "ACTION",
  TRIGGER = "TRIGGER",
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
  COLLECT = "COLLECT",
  OPENAI = "OPENAI",
  TRIGGER_AUTOMATION_RUN = "TRIGGER_AUTOMATION_RUN",
  BRANCH = "BRANCH",
  // these used to be lowercase step IDs, maintain for backwards compat
  discord = "discord",
  slack = "slack",
  zapier = "zapier",
  integromat = "integromat",
  n8n = "n8n",
}

export interface EmailInvite {
  startTime: Date
  endTime: Date
  summary: string
  location?: string
  url?: string
}

export interface EmailAttachment {
  url: string
  filename: string
}

export interface SendEmailOpts {
  to?: string
  // workspaceId If finer grain controls being used then this will lookup config for workspace.
  workspaceId?: string
  // user If sending to an existing user the object can be provided, this is used in the context.
  user: User
  // from If sending from an address that is not what is configured in the SMTP config.
  from?: string
  // contents If sending a custom email then can supply contents which will be added to it.
  contents?: string
  // subject A custom subject can be specified if the config one is not desired.
  subject: string
  // info Pass in a structure of information to be stored alongside the invitation.
  info?: any
  cc?: boolean
  bcc?: boolean
  automation?: boolean
  invite?: EmailInvite
  attachments?: EmailAttachment[]
}

export const AutomationStepIdArray = [
  ...Object.values(AutomationActionStepId),
  ...Object.values(AutomationTriggerStepId),
]

export interface Automation extends Document {
  definition: {
    steps: AutomationStep[]
    trigger: AutomationTrigger
    // stepNames is used to lookup step names from their correspnding step ID.
    stepNames?: Record<string, string>
  }
  screenId?: string
  uiTree?: any
  appId: string
  live?: boolean
  name: string
  internal?: boolean
  type?: string
  disabled?: boolean
  testData?: {
    row?: Row
    meta: {
      [key: string]: unknown
    }
    id: string
    revision: string
    oldRow?: Row
  }
}

interface BaseIOStructure {
  type?: AutomationIOType
  subtype?: AutomationIOType
  customType?: AutomationCustomIOType
  title?: string
  description?: string
  dependsOn?: string
  enum?: string[]
  pretty?: string[]
  properties?: {
    [key: string]: BaseIOStructure
  }
  required?: string[]
  readonly?: true
}

export interface InputOutputBlock {
  properties: {
    [key: string]: BaseIOStructure
  }
  required?: string[]
}

export enum AutomationFeature {
  LOOPING = "LOOPING",
}

export enum AutomationStepStatus {
  NO_ITERATIONS = "no_iterations",
  MAX_ITERATIONS = "max_iterations_reached",
}

export enum AutomationStatus {
  SUCCESS = "success",
  ERROR = "error",
  STOPPED = "stopped",
  STOPPED_ERROR = "stopped_error",
  NO_CONDITION_MET = "No branch condition met",
}

export enum AutomationStoppedReason {
  TRIGGER_FILTER_NOT_MET = "Automation did not run. Filter conditions in trigger were not met.",
}

export interface AutomationResults {
  automationId?: string
  status?: AutomationStatus
  trigger?: AutomationTrigger
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

export interface AutomationStepInputBase {
  context: Record<string, any>
  emitter: EventEmitter
  appId: string
  apiKey?: string
}

export type ActionImplementation<TInputs, TOutputs> = (
  params: {
    inputs: TInputs
  } & AutomationStepInputBase
) => Promise<TOutputs>
export interface AutomationMetadata extends Document {
  errorCount?: number
  automationChainCount?: number
}

export type AutomationAttachment = {
  url: string
  filename: string
}

export type AutomationAttachmentContent = {
  filename: string
  content: ReadStream | NodeJS.ReadableStream
}

export type BucketedContent = AutomationAttachmentContent & {
  bucket: string
  path: string
}

export enum AutomationEventType {
  ROW_SAVE = "row:save",
  ROW_UPDATE = "row:update",
  ROW_DELETE = "row:delete",
  APP_TRIGGER = "app:trigger",
  CRON_TRIGGER = "cron:trigger",
  WEBHOOK_TRIGGER = "web:trigger",
  ROW_ACTION = "row:action",
}

export type UpdatedRowEventEmitter = {
  row: Row
  oldRow: Row
  table: Table
  appId: string
  user: User
}

export enum LoopStepType {
  ARRAY = "Array",
  STRING = "String",
}
