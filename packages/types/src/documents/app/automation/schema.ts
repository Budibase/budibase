import { SortOrder } from "../../../api"
import { EmptyFilterOption, SearchFilters } from "../../../sdk"
import { HttpMethod } from "../query"
import { Row } from "../row"
import { AutomationResults, EmailAttachment, LoopStepType } from "./automation"

export type BaseAutomationOutputs = {
  success?: boolean
  response?: {
    [key: string]: any
    message?: string
  }
}

export type ExternalAppStepOutputs = {
  httpStatus: number
  response: string
  success: boolean
}

export type BashStepInputs = {
  code: string
}

export type BashStepOutputs = BaseAutomationOutputs & {
  stdout?: string
}

export type CollectStepInputs = {
  collection: string
}

export type CollectStepOutputs = BaseAutomationOutputs & {
  value?: any
}

export type CreateRowStepInputs = {
  row: Row
}

export type CreateRowStepOutputs = BaseAutomationOutputs & {
  row?: Row
  id?: string
  revision?: string
}

export type DelayStepInputs = {
  time: number
}

export type DelayStepOutputs = BaseAutomationOutputs

export type DeleteRowStepInputs = {
  tableId: string
  id: string
  revision?: string
}

export type DeleteRowStepOutputs = BaseAutomationOutputs & {
  row?: Row
}

export type DiscordStepInputs = {
  url: string
  username?: string
  avatar_url?: string
  content: string
}

export type ExecuteQueryStepInputs = {
  query: {
    queryId: string
  }
}

export type ExecuteQueryStepOutputs = BaseAutomationOutputs & {
  info?: any
}

export type ExecuteScriptStepInputs = {
  code: string
}

export type ExecuteScriptStepOutputs = BaseAutomationOutputs & {
  value?: string
}

export type FilterStepInputs = {
  field: any
  condition: string
  value: any
}

export type FilterStepOutputs = BaseAutomationOutputs & {
  result: boolean
  refValue?: any
  comparisonValue?: any
}

export type LoopStepInputs = {
  option: LoopStepType
  binding: any
  iterations?: number
  failure?: string
}

export type LoopStepOutputs = {
  items: string
  success: boolean
  iterations: number
}

export type MakeIntegrationInputs = {
  url: string
  body: any
}

export type n8nStepInputs = {
  url: string
  method: HttpMethod
  authorization: string
  body: any
}

export type OpenAIStepInputs = {
  prompt: string
  model: Model
}

enum Model {
  GPT_35_TURBO = "gpt-3.5-turbo",
  // will only work with api keys that have access to the GPT4 API
  GPT_4 = "gpt-4",
}

export type OpenAIStepOutputs = Omit<BaseAutomationOutputs, "response"> & {
  response?: string | null
}

export type QueryRowsStepInputs = {
  tableId: string
  filters: SearchFilters
  "filters-def": any
  sortColumn: string
  sortOrder: SortOrder
  limit: number
  onEmptyFilter: EmptyFilterOption
}

export type QueryRowsStepOutputs = BaseAutomationOutputs & {
  rows?: Row[]
}

export type smtpEmailStepInputs = {
  to: string
  from: string
  subject: string
  contents: string
  cc: string
  bcc: string
  addInvite?: boolean
  startTime: Date
  endTime: Date
  summary: string
  location?: string
  url?: string
  attachments?: EmailAttachment[]
}
export type serverLogStepInputs = {
  text: string
}

export type serverLogStepOutputs = BaseAutomationOutputs & {
  message: string
}
export type SlackStepInputs = {
  url: string
  text: string
}

export type TriggerAutomationStepInputs = {
  automation: {
    automationId: string
  }
  timeout: number
}

export type TriggerAutomationStepOutputs = BaseAutomationOutputs & {
  value?: AutomationResults["steps"]
}

export type UpdateRowStepInputs = {
  meta: Record<string, any>
  row: Row
  rowId: string
}

export type UpdateRowStepOutputs = BaseAutomationOutputs & {
  row?: Row
  id?: string
  revision?: string
}

export type ZapierStepInputs = {
  url: string
  body: any
}

export type ZapierStepOutputs = Omit<ExternalAppStepOutputs, "response"> & {
  response: string
}
