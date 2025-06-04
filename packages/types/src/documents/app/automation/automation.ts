import { Document } from "../../document"
import { User } from "../../global"
import { Row } from "../row"
import { Table } from "../table"
import { AutomationStep, AutomationTrigger } from "./schema"
import { ContextEmitter } from "../../../sdk"
import { Readable } from "stream"

export enum AutomationIOType {
  OBJECT = "object",
  STRING = "string",
  BOOLEAN = "boolean",
  NUMBER = "number",
  ARRAY = "array",
  JSON = "json",
  DATE = "date",
  DATETIME = "datetime",
  ATTACHMENT = "attachment",
  LONGFORM = "longform",
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
  CATEGORIES = "categories",
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
  EXECUTE_SCRIPT_V2 = "EXECUTE_SCRIPT_V2",
  EXECUTE_QUERY = "EXECUTE_QUERY",
  SERVER_LOG = "SERVER_LOG",
  DELAY = "DELAY",
  FILTER = "FILTER",
  API_REQUEST = "API_REQUEST",
  QUERY_ROWS = "QUERY_ROWS",
  LOOP = "LOOP",
  COLLECT = "COLLECT",
  OPENAI = "OPENAI",
  TRIGGER_AUTOMATION_RUN = "TRIGGER_AUTOMATION_RUN",
  BRANCH = "BRANCH",
  CLASSIFY_CONTENT = "CLASSIFY_CONTENT",
  PROMPT_LLM = "PROMPT_LLM",
  TRANSLATE = "TRANSLATE",
  SUMMARISE = "SUMMARISE",
  GENERATE_TEXT = "GENERATE_TEXT",
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
  user?: User
  // from If sending from an address that is not what is configured in the SMTP config.
  from?: string
  // contents If sending a custom email then can supply contents which will be added to it.
  contents?: string
  // subject A custom subject can be specified if the config one is not desired.
  subject: string
  // info Pass in a structure of information to be stored alongside the invitation.
  info?: any
  cc?: string
  bcc?: string
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
  testData?: AutomationTriggerResultOutputs
}

export interface BaseIOStructure {
  type?: AutomationIOType
  subtype?: AutomationIOType
  customType?: AutomationCustomIOType
  title?: string
  description?: string
  dependsOn?: string
  enum?: string[]
  pretty?: string[]
  properties?: AutomationIOProps
  required?: string[]
  readonly?: true
}

export interface InputOutputBlock {
  properties: AutomationIOProps
  required?: string[]
}

export interface AutomationIOProps {
  [key: string]: BaseIOStructure
}

export enum AutomationFeature {
  LOOPING = "LOOPING",
}

export enum AutomationStepStatus {
  NO_ITERATIONS = "no_iterations",
  MAX_ITERATIONS = "max_iterations_reached",
  FAILURE_CONDITION = "FAILURE_CONDITION_MET",
  INCORRECT_TYPE = "INCORRECT_TYPE",
}

export enum AutomationStatus {
  SUCCESS = "success",
  ERROR = "error",
  STOPPED = "stopped",
  STOPPED_ERROR = "stopped_error",
  NO_CONDITION_MET = "No branch condition met",
  TIMED_OUT = "timed_out",
}

export enum AutomationStoppedReason {
  TRIGGER_FILTER_NOT_MET = "Automation did not run. Filter conditions in trigger were not met.",
  TIMED_OUT = "Automation timed out.",
}

export interface AutomationStepResultOutputs {
  success: boolean
  [key: string]: any
}

export interface AutomationStepResultInputs {
  [key: string]: any
}

export interface AutomationStepResult {
  id: string
  stepId: AutomationActionStepId
  inputs: AutomationStepResultInputs
  outputs: AutomationStepResultOutputs
}

export type AutomationTriggerResultInputs = Record<string, any>
export type AutomationTriggerResultOutputs = Record<string, any>

export interface AutomationTriggerResult {
  id: string
  stepId: AutomationTriggerStepId
  inputs?: AutomationTriggerResultInputs | null
  outputs: AutomationTriggerResultOutputs
}

export interface AutomationResults {
  automationId?: string
  status: AutomationStatus
  trigger: AutomationTriggerResult
  steps: [AutomationTriggerResult, ...AutomationStepResult[]]
}

export interface DidNotTriggerResponse {
  outputs: {
    success: false
    status: AutomationStatus.STOPPED
  }
  message: AutomationStoppedReason.TRIGGER_FILTER_NOT_MET
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
  emitter: ContextEmitter
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
  content: Readable
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

export enum ContentType {
  EMAIL = "email",
  DOCUMENT = "document",
  BLOG_POST = "blog_post",
  CHAT_MESSAGE = "chat_message",
  LETTER = "letter",
  PROPOSAL = "proposal",
  OTHER = "other",
}

export const PrettyContentTypes = {
  [ContentType.EMAIL]: "Email",
  [ContentType.DOCUMENT]: "Document",
  [ContentType.BLOG_POST]: "Blog post",
  [ContentType.CHAT_MESSAGE]: "Chat message",
  [ContentType.LETTER]: "Letter",
  [ContentType.PROPOSAL]: "Proposal",
  [ContentType.OTHER]: "Other",
}
