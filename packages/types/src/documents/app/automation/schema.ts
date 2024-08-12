import { Hosting } from "../../../sdk"
import {
  AutomationActionStepId,
  ActionImplementation,
  AutomationStepType,
  AutomationFeature,
  InputOutputBlock,
  AutomationTriggerStepId,
} from "./automation"
import {
  CollectStepInputs,
  CollectStepOutputs,
  CreateRowStepInputs,
  CreateRowStepOutputs,
  DelayStepInputs,
  DelayStepOutputs,
  DeleteRowStepInputs,
  DeleteRowStepOutputs,
  ExecuteQueryStepInputs,
  ExecuteQueryStepOutputs,
  ExecuteScriptStepInputs,
  ExecuteScriptStepOutputs,
  FilterStepInputs,
  FilterStepOutputs,
  QueryRowsStepInputs,
  QueryRowsStepOutputs,
  SmtpEmailStepInputs,
  BaseAutomationOutputs,
  ServerLogStepInputs,
  ServerLogStepOutputs,
  TriggerAutomationStepInputs,
  TriggerAutomationStepOutputs,
  UpdateRowStepInputs,
  UpdateRowStepOutputs,
  OutgoingWebhookStepInputs,
  ExternalAppStepOutputs,
  DiscordStepInputs,
  SlackStepInputs,
  ZapierStepInputs,
  ZapierStepOutputs,
  MakeIntegrationInputs,
  n8nStepInputs,
  BashStepInputs,
  BashStepOutputs,
  OpenAIStepInputs,
  OpenAIStepOutputs,
  LoopStepInputs,
  AppActionTriggerInputs,
  CronTriggerInputs,
  RowUpdatedTriggerInputs,
  RowCreatedTriggerInputs,
  RowDeletedTriggerInputs,
} from "./StepInputsOutputs"

export type ActionImplementations<T extends Hosting> = {
  [AutomationActionStepId.COLLECT]: ActionImplementation<
    CollectStepInputs,
    CollectStepOutputs
  >
  [AutomationActionStepId.CREATE_ROW]: ActionImplementation<
    CreateRowStepInputs,
    CreateRowStepOutputs
  >
  [AutomationActionStepId.DELAY]: ActionImplementation<
    DelayStepInputs,
    DelayStepOutputs
  >
  [AutomationActionStepId.DELETE_ROW]: ActionImplementation<
    DeleteRowStepInputs,
    DeleteRowStepOutputs
  >
  [AutomationActionStepId.EXECUTE_QUERY]: ActionImplementation<
    ExecuteQueryStepInputs,
    ExecuteQueryStepOutputs
  >
  [AutomationActionStepId.EXECUTE_SCRIPT]: ActionImplementation<
    ExecuteScriptStepInputs,
    ExecuteScriptStepOutputs
  >
  [AutomationActionStepId.FILTER]: ActionImplementation<
    FilterStepInputs,
    FilterStepOutputs
  >
  [AutomationActionStepId.QUERY_ROWS]: ActionImplementation<
    QueryRowsStepInputs,
    QueryRowsStepOutputs
  >
  [AutomationActionStepId.SEND_EMAIL_SMTP]: ActionImplementation<
    SmtpEmailStepInputs,
    BaseAutomationOutputs
  >
  [AutomationActionStepId.SERVER_LOG]: ActionImplementation<
    ServerLogStepInputs,
    ServerLogStepOutputs
  >
  [AutomationActionStepId.TRIGGER_AUTOMATION_RUN]: ActionImplementation<
    TriggerAutomationStepInputs,
    TriggerAutomationStepOutputs
  >
  [AutomationActionStepId.UPDATE_ROW]: ActionImplementation<
    UpdateRowStepInputs,
    UpdateRowStepOutputs
  >
  [AutomationActionStepId.OUTGOING_WEBHOOK]: ActionImplementation<
    OutgoingWebhookStepInputs,
    ExternalAppStepOutputs
  >
  [AutomationActionStepId.discord]: ActionImplementation<
    DiscordStepInputs,
    ExternalAppStepOutputs
  >
  [AutomationActionStepId.slack]: ActionImplementation<
    SlackStepInputs,
    ExternalAppStepOutputs
  >
  [AutomationActionStepId.zapier]: ActionImplementation<
    ZapierStepInputs,
    ZapierStepOutputs
  >
  [AutomationActionStepId.integromat]: ActionImplementation<
    MakeIntegrationInputs,
    ExternalAppStepOutputs
  >
  [AutomationActionStepId.n8n]: ActionImplementation<
    n8nStepInputs,
    ExternalAppStepOutputs
  >
} & (T extends "self"
  ? {
      [AutomationActionStepId.EXECUTE_BASH]: ActionImplementation<
        BashStepInputs,
        BashStepOutputs
      >
      [AutomationActionStepId.OPENAI]: ActionImplementation<
        OpenAIStepInputs,
        OpenAIStepOutputs
      >
    }
  : {})

export interface AutomationStepSchemaBase {
  name: string
  stepTitle?: string
  tagline: string
  icon: string
  description: string
  type: AutomationStepType
  internal?: boolean
  deprecated?: boolean
  blockToLoop?: string
  schema: {
    inputs: InputOutputBlock
    outputs: InputOutputBlock
  }
  custom?: boolean
  features?: Partial<Record<AutomationFeature, boolean>>
}

export interface AutomationStepSchema extends AutomationStepSchemaBase {
  id: string
}

export interface CollectStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.COLLECT
  inputs: CollectStepInputs
}

export interface CreateRowStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.CREATE_ROW
  inputs: CreateRowStepInputs
}

export interface DelayStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.DELAY
  inputs: DelayStepInputs
}

export interface DeleteRowStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.DELETE_ROW
  inputs: DeleteRowStepInputs
}

export interface ExecuteQueryStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.EXECUTE_QUERY
  inputs: ExecuteQueryStepInputs
}

export interface ExecuteScriptStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.EXECUTE_SCRIPT
  inputs: ExecuteScriptStepInputs
}

export interface FilterStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.FILTER
  inputs: FilterStepInputs
}

export interface QueryRowsStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.QUERY_ROWS
  inputs: QueryRowsStepInputs
}

export interface SendEmailSmtpStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.SEND_EMAIL_SMTP
  inputs: SmtpEmailStepInputs
}

export interface ServerLogStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.SERVER_LOG
  inputs: ServerLogStepInputs
}

export interface TriggerAutomationRunStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.TRIGGER_AUTOMATION_RUN
  inputs: TriggerAutomationStepInputs
}

export interface UpdateRowStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.UPDATE_ROW
  inputs: UpdateRowStepInputs
}

export interface OutgoingWebhookStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.OUTGOING_WEBHOOK
  inputs: OutgoingWebhookStepInputs
}

export interface DiscordStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.discord
  inputs: DiscordStepInputs
}

export interface SlackStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.slack
  inputs: SlackStepInputs
}

export interface ZapierStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.zapier
  inputs: ZapierStepInputs
}

export interface IntegromatStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.integromat
  inputs: MakeIntegrationInputs
}

export interface N8nStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.n8n
  inputs: n8nStepInputs
}

export interface ExecuteBashStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.EXECUTE_BASH
  inputs: BashStepInputs
}

export interface OpenAIStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.OPENAI
  inputs: OpenAIStepInputs
}

export interface LoopStep extends AutomationStepSchema {
  stepId: AutomationActionStepId.LOOP
  inputs: LoopStepInputs
}

export type AutomationStep =
  | CollectStep
  | CreateRowStep
  | DelayStep
  | DeleteRowStep
  | ExecuteQueryStep
  | ExecuteScriptStep
  | FilterStep
  | QueryRowsStep
  | SendEmailSmtpStep
  | ServerLogStep
  | TriggerAutomationRunStep
  | UpdateRowStep
  | OutgoingWebhookStep
  | DiscordStep
  | SlackStep
  | ZapierStep
  | IntegromatStep
  | N8nStep
  | LoopStep
  | ExecuteBashStep
  | OpenAIStep

export type AutomationStepInputsOnly = {
  [K in keyof typeof AutomationActionStepId]: Extract<
    AutomationStep,
    { stepId: (typeof AutomationActionStepId)[K] }
  >["inputs"]
}
// export type AutomationTrigger =
//   | AppActionTrigger
//   | CronTrigger
//   | RowActionTrigger
//   | RowDeletedTrigger
//   | RowSavedTrigger
//   | RowUpdatedTrigger
//   | WebhookTrigger

type EmptyInputs = {}
export type AutomationStepDefinition = Omit<AutomationStep, "id" | "inputs"> & {
  inputs: EmptyInputs
}

export type AutomationTriggerDefinition = Omit<
  AutomationTrigger,
  "id" | "inputs"
> & {
  inputs: EmptyInputs
}

export interface AutomationTriggerSchema extends AutomationStepSchemaBase {
  id: string
  type: AutomationStepType.TRIGGER
  event?: string
  cronJobId?: string
}

export interface AutomationTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId
  inputs: Record<string, any>
}

export interface AppActionTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.APP
  inputs: AppActionTriggerInputs
}

export interface CronTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.CRON
  inputs: CronTriggerInputs
}

export interface RowActionTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.ROW_ACTION
  inputs: Record<string, any>
}

export interface RowDeletedTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.ROW_DELETED
  inputs: RowDeletedTriggerInputs
}

export interface RowSavedTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.ROW_SAVED
  inputs: RowCreatedTriggerInputs
}

export interface RowUpdatedTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.ROW_UPDATED
  inputs: RowUpdatedTriggerInputs
}

export interface WebhookTrigger extends AutomationTriggerSchema {
  stepId: AutomationTriggerStepId.WEBHOOK
  inputs: Record<string, any>
}
