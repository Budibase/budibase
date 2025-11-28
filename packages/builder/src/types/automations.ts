import {
  type Automation,
  type AutomationStep,
  type AutomationStepInputs,
  type AutomationStepResult,
  type AutomationTrigger,
  type AutomationTriggerInputs,
  type AutomationTriggerResult,
  type BaseIOStructure,
  type BlockDefinitions,
  type BlockPath,
  type BlockRef,
  type SelfResponse,
  type TestAutomationResponse,
  type UISearchFilter,
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationLog,
  AutomationTriggerStepId,
  UIAutomation,
  Branch,
  LayoutDirection,
  LoopV2Step,
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
  AGENT = "agent",
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

export type AutomationLogStep = AutomationTriggerResult | AutomationStepResult

export type ReconstructedBlock = AutomationLogStep & {
  name: string
  icon: string
}

export type AutomationBlock =
  | AutomationStep
  | AutomationTrigger
  | ReconstructedBlock

type AutomationBlockContext = AutomationBlock & { branchNode?: false }

export type BranchPathEntry = Partial<BlockPath> & {
  branchIdx: number
  branchStepId: string
  stepIdx?: number
}

export type FlowBlockPath = Array<BlockPath | BranchPathEntry>

export interface BranchFlowContext {
  branchNode: true
  pathTo: FlowBlockPath
  branchIdx: number
  branchStepId: string
}

export type FlowBlockContext = AutomationBlockContext | BranchFlowContext

export type AutomationBlockRef = BlockRef & {
  stepId?: string
  name?: string
  looped?: string
  blockToLoop?: string
  inputs?: Record<string, unknown>
}

export type AutomationBlockRefMap = Record<string, AutomationBlockRef>

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

export interface AutomationStoreState<T extends Automation = Automation> {
  automations: T[]
  testResults?: TestAutomationResponse
  showTestModal: boolean
  blockDefinitions: BlockDefinitions
  selectedAutomationId: string | null
  appSelf?: SelfResponse
  selectedNodeId?: string
  selectedNodeMode?: DataMode
  actionPanelBlock?: BlockRef
  selectedLog?: AutomationLog
  selectedLogStepData?: any
  showLogsPanel?: boolean
  showLogDetailsPanel?: boolean
  viewMode: ViewMode
}

export interface DerivedAutomationStoreState
  extends AutomationStoreState<UIAutomation> {}

export interface SelectedAutomationState {
  data?: UIAutomation
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

/**
 * SvelteFlow Node Data Types
 */
export interface StepNodeData {
  block: AutomationBlock
  direction?: LayoutDirection
  [key: string]: unknown
}

export interface BranchNodeData {
  block: AutomationBlock
  branch: Branch
  branchIdx: number
  direction?: LayoutDirection
  isSubflow?: boolean
  laneWidth?: number
  [key: string]: unknown
}

export interface LoopV2NodeData {
  block: LoopV2Step
  direction?: LayoutDirection
  containerHeight: number
  containerWidth: number
  [key: string]: unknown
}

export interface AnchorNodeData {
  direction?: LayoutDirection
  [key: string]: unknown
}

/**
 * SvelteFlow Edge Data Types
 */
export interface BaseEdgeData {
  block: FlowBlockContext
  direction?: LayoutDirection
  pathTo?: FlowBlockPath
  isSubflowEdge?: boolean
  [key: string]: unknown
}

export interface BranchEdgeData extends BaseEdgeData {
  isBranchEdge: true
  isPrimaryEdge: boolean
  branchStepId: string
  branchIdx: number
  branchesCount: number
  loopStepId?: string
  loopChildInsertIndex?: number
  insertIntoLoopV2?: true
}

export interface LoopEdgeData extends BaseEdgeData {
  insertIntoLoopV2?: boolean
  loopStepId: string
  loopChildInsertIndex: number
}

export type EdgeData = BaseEdgeData | BranchEdgeData | LoopEdgeData
export interface RowAction {
  id: string
  name: string
  tableId: string
  allowedSources?: string[]
}
