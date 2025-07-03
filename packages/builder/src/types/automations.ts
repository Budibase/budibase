import {
  type AutomationStep,
  type AutomationStepInputs,
  type AutomationTrigger,
  type AutomationTriggerInputs,
  type BaseIOStructure,
  type UISearchFilter,
  type TestAutomationResponse,
  type AppSelfResponse,
  type Automation,
  type BlockDefinitions,
  type BlockRef,
  AutomationActionStepId,
  AutomationTriggerStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationLog,
} from "@budibase/types"
import { SvelteComponent } from "svelte"

export enum DataMode {
  INPUT = "data_in",
  OUTPUT = "data_out",
  ERRORS = "errors",
}

export enum ViewMode {
  EDITOR = "editor",
  LOGS = "logs",
}

export enum SchemaFieldTypes {
  LONGFORM = "longform",
  JSON = "json",
  ENUM = "enum",
  BOOL = "boolean",
  DATE = "date",
  FILE = "file",
  FILTER = "filter",
  CRON = "cron",
  FIELDS = "fields",
  TABLE = "table",
  COLUMN = "column",
  AUTOMATION_FIELDS = "automation_fields",
  WEBHOOK_URL = "webhook_url",
  TRIGGER_SCHEMA = "trigger_schema",
  LOOP_OPTION = "loop_option",
  CODE = "code",
  CODE_V2 = "code_v2",
  STRING = "string",
  QUERY_PARAMS = "query_params",
  QUERY_LIMIT = "query_limit",
  CATEGORIES = "categories",
}

export type KeyValuePair = {
  name: string
  value: string
}

// Required for filter fields. The have a definition entry
// as well as a configuration
export type DynamicProperties = {
  [property: `${string}-def`]: UISearchFilter
}

// Form field update by property key
export type FormUpdate = Record<string, unknown>

export type AutomationSchemaConfig = Record<SchemaFieldTypes, SchemaConfigProps>

export type FieldProps = {
  key: string
  field: BaseIOStructure
  block: AutomationStep | AutomationTrigger
  value: any
  meta: any
  title: string
}

// Unused for the moment
export type InputMeta = {
  meta?: AutomationStepInputMeta<AutomationActionStepId>
}

// This is still Attachment Specific and technically reusable.
export type FileSelectorMeta = { useAttachmentBinding: boolean }

export type AutomationStepInputMeta<T extends AutomationActionStepId> =
  T extends AutomationActionStepId.SEND_EMAIL_SMTP
    ? { meta: FileSelectorMeta }
    : { meta?: Record<string, unknown> }

export type StepInputs =
  | AutomationStepInputs<AutomationActionStepId> //& InputMeta
  | AutomationTriggerInputs<AutomationTriggerStepId> //& InputMeta
  | undefined

export const RowTriggers = [
  AutomationTriggerStepId.ROW_UPDATED,
  AutomationTriggerStepId.ROW_SAVED,
  AutomationTriggerStepId.ROW_DELETED,
  AutomationTriggerStepId.ROW_ACTION,
]

export const RowSteps = [
  AutomationActionStepId.CREATE_ROW,
  AutomationActionStepId.UPDATE_ROW,
  AutomationActionStepId.DELETE_ROW,
]

export const FilterableRowTriggers = [
  AutomationTriggerStepId.ROW_UPDATED,
  AutomationTriggerStepId.ROW_SAVED,
]

/**
 * Used to define how to represent automation setting
 * forms
 */
export interface SchemaConfigProps {
  comp: typeof SvelteComponent<any>
  onChange?: (e: CustomEvent) => void
  props?: (opts?: FieldProps) => Record<string, unknown>
  fullWidth?: boolean
  title?: string
  tooltip?: string
  wrapped?: boolean
}

export interface AutomationState {
  automations: Automation[]
  testResults?: TestAutomationResponse
  showTestModal: boolean
  blockDefinitions: BlockDefinitions
  selectedAutomationId: string | null
  appSelf?: AppSelfResponse
  selectedNodeId?: string
  selectedNodeMode?: DataMode
  actionPanelBlock?: BlockRef
  selectedLog?: AutomationLog
  selectedLogStepData?: any
  showLogsPanel?: boolean
  showLogDetailsPanel?: boolean
}

export interface DerivedAutomationState extends AutomationState {
  data?: Automation
  blockRefs: Record<string, BlockRef>
}

/**
 * BlockProperties - Direct mapping of customType to SchemaFieldTypes
 */
export const customTypeToSchema: Record<string, SchemaFieldTypes> = {
  [AutomationCustomIOType.TRIGGER_SCHEMA]: SchemaFieldTypes.TRIGGER_SCHEMA,
  [AutomationCustomIOType.TABLE]: SchemaFieldTypes.TABLE,
  [AutomationCustomIOType.COLUMN]: SchemaFieldTypes.COLUMN,
  [AutomationCustomIOType.CRON]: SchemaFieldTypes.CRON,
  [AutomationCustomIOType.LOOP_OPTION]: SchemaFieldTypes.LOOP_OPTION,
  [AutomationCustomIOType.AUTOMATION_FIELDS]:
    SchemaFieldTypes.AUTOMATION_FIELDS,
  [AutomationCustomIOType.WEBHOOK_URL]: SchemaFieldTypes.WEBHOOK_URL,
  [AutomationCustomIOType.QUERY_LIMIT]: SchemaFieldTypes.QUERY_LIMIT,
  [AutomationCustomIOType.QUERY_PARAMS]: SchemaFieldTypes.QUERY_PARAMS,
  [AutomationCustomIOType.CATEGORIES]: SchemaFieldTypes.CATEGORIES,
  ["fields"]: SchemaFieldTypes.FIELDS,
}

/**
 * BlockProperties - Direct mapping of type to SchemaFieldTypes
 */
export const typeToSchema: Partial<Record<AutomationIOType, SchemaFieldTypes>> =
  {
    [AutomationIOType.BOOLEAN]: SchemaFieldTypes.BOOL,
    [AutomationIOType.LONGFORM]: SchemaFieldTypes.LONGFORM,
    [AutomationIOType.DATE]: SchemaFieldTypes.DATE,
    [AutomationIOType.JSON]: SchemaFieldTypes.JSON,
    [AutomationIOType.ATTACHMENT]: SchemaFieldTypes.FILE,
  }

/**
 * FlowItem - Status type enums for grading issues
 */
export enum FlowStatusType {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  SUCCESS = "success",
}

/**
 * FlowItemStatus - Message structure for building information
 * pills that hover above the steps in the automation tree
 */
export type FlowItemStatus = {
  message: string
  icon: string
  type: FlowStatusType
  tooltip?: string
}

/**
 * BlockData - Status type designation for errors or issues arising from
 * test runs or other automation concerns
 */
export enum BlockStatusType {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * BlockData - Source type used to discern the source of the issues
 */
export enum BlockStatusSource {
  AUTOMATION_RESULTS = "results",
  VALIDATION = "validation",
}

/**
 * BlockData - Message structure for building out issues to be displayed
 * in the Step Panel in automations
 */
export type BlockStatus = {
  message: string
  type: BlockStatusType
  source?: BlockStatusSource
}
