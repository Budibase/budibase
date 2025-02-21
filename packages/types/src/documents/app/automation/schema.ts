import { Hosting } from "../../../sdk"
import {
  AutomationActionStepId,
  ActionImplementation,
  AutomationStepType,
  AutomationFeature,
  InputOutputBlock,
  AutomationTriggerStepId,
  AutomationEventType,
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
  CronTriggerInputs,
  RowUpdatedTriggerInputs,
  RowCreatedTriggerInputs,
  RowDeletedTriggerInputs,
  BranchStepInputs,
  BaseAutomationOutputs,
  AppActionTriggerOutputs,
  CronTriggerOutputs,
  RowDeletedTriggerOutputs,
  RowCreatedTriggerOutputs,
  RowUpdatedTriggerOutputs,
  WebhookTriggerOutputs,
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
  [AutomationActionStepId.EXECUTE_SCRIPT_V2]: ActionImplementation<
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
  [AutomationActionStepId.OPENAI]: ActionImplementation<
    OpenAIStepInputs,
    OpenAIStepOutputs
  >
} & (T extends "self"
  ? {
      [AutomationActionStepId.EXECUTE_BASH]: ActionImplementation<
        BashStepInputs,
        BashStepOutputs
      >
    }
  : {})

export interface AutomationStepSchemaBase {
  name: string
  stepTitle?: string
  event?: AutomationEventType
  tagline: string
  icon: string
  description: string
  type: AutomationStepType
  internal?: boolean
  deprecated?: boolean
  new?: boolean
  blockToLoop?: string
  schema: {
    inputs: InputOutputBlock
    outputs: InputOutputBlock
  }
  custom?: boolean
  features?: Partial<Record<AutomationFeature, boolean>>
}

export type AutomationStepInputs<T extends AutomationActionStepId> =
  T extends AutomationActionStepId.COLLECT
    ? CollectStepInputs
    : T extends AutomationActionStepId.CREATE_ROW
    ? CreateRowStepInputs
    : T extends AutomationActionStepId.DELAY
    ? DelayStepInputs
    : T extends AutomationActionStepId.DELETE_ROW
    ? DeleteRowStepInputs
    : T extends AutomationActionStepId.EXECUTE_QUERY
    ? ExecuteQueryStepInputs
    : T extends AutomationActionStepId.EXECUTE_SCRIPT
    ? ExecuteScriptStepInputs
    : T extends AutomationActionStepId.EXECUTE_SCRIPT_V2
    ? ExecuteScriptStepInputs
    : T extends AutomationActionStepId.FILTER
    ? FilterStepInputs
    : T extends AutomationActionStepId.QUERY_ROWS
    ? QueryRowsStepInputs
    : T extends AutomationActionStepId.SEND_EMAIL_SMTP
    ? SmtpEmailStepInputs
    : T extends AutomationActionStepId.SERVER_LOG
    ? ServerLogStepInputs
    : T extends AutomationActionStepId.TRIGGER_AUTOMATION_RUN
    ? TriggerAutomationStepInputs
    : T extends AutomationActionStepId.UPDATE_ROW
    ? UpdateRowStepInputs
    : T extends AutomationActionStepId.OUTGOING_WEBHOOK
    ? OutgoingWebhookStepInputs
    : T extends AutomationActionStepId.discord
    ? DiscordStepInputs
    : T extends AutomationActionStepId.slack
    ? SlackStepInputs
    : T extends AutomationActionStepId.zapier
    ? ZapierStepInputs
    : T extends AutomationActionStepId.integromat
    ? MakeIntegrationInputs
    : T extends AutomationActionStepId.n8n
    ? n8nStepInputs
    : T extends AutomationActionStepId.EXECUTE_BASH
    ? BashStepInputs
    : T extends AutomationActionStepId.OPENAI
    ? OpenAIStepInputs
    : T extends AutomationActionStepId.LOOP
    ? LoopStepInputs
    : T extends AutomationActionStepId.BRANCH
    ? BranchStepInputs
    : never

export type AutomationStepOutputs<T extends AutomationActionStepId> =
  T extends AutomationActionStepId.COLLECT
    ? CollectStepOutputs
    : T extends AutomationActionStepId.CREATE_ROW
    ? CreateRowStepOutputs
    : T extends AutomationActionStepId.DELAY
    ? DelayStepOutputs
    : T extends AutomationActionStepId.DELETE_ROW
    ? DeleteRowStepOutputs
    : T extends AutomationActionStepId.EXECUTE_QUERY
    ? ExecuteQueryStepOutputs
    : T extends AutomationActionStepId.EXECUTE_SCRIPT
    ? ExecuteScriptStepOutputs
    : T extends AutomationActionStepId.FILTER
    ? FilterStepOutputs
    : T extends AutomationActionStepId.QUERY_ROWS
    ? QueryRowsStepOutputs
    : T extends AutomationActionStepId.SEND_EMAIL_SMTP
    ? BaseAutomationOutputs
    : T extends AutomationActionStepId.SERVER_LOG
    ? ServerLogStepOutputs
    : T extends AutomationActionStepId.TRIGGER_AUTOMATION_RUN
    ? TriggerAutomationStepOutputs
    : T extends AutomationActionStepId.UPDATE_ROW
    ? UpdateRowStepOutputs
    : T extends AutomationActionStepId.OUTGOING_WEBHOOK
    ? ExternalAppStepOutputs
    : T extends AutomationActionStepId.discord
    ? ExternalAppStepOutputs
    : T extends AutomationActionStepId.slack
    ? ExternalAppStepOutputs
    : T extends AutomationActionStepId.zapier
    ? ZapierStepOutputs
    : T extends AutomationActionStepId.integromat
    ? ExternalAppStepOutputs
    : T extends AutomationActionStepId.n8n
    ? ExternalAppStepOutputs
    : T extends AutomationActionStepId.EXECUTE_BASH
    ? BashStepOutputs
    : T extends AutomationActionStepId.OPENAI
    ? OpenAIStepOutputs
    : T extends AutomationActionStepId.LOOP
    ? BaseAutomationOutputs
    : never

export interface AutomationStepSchema<TStep extends AutomationActionStepId>
  extends AutomationStepSchemaBase {
  id: string
  stepId: TStep
  inputs: AutomationStepInputs<TStep>
}

export type CollectStep = AutomationStepSchema<AutomationActionStepId.COLLECT>

export type CreateRowStep =
  AutomationStepSchema<AutomationActionStepId.CREATE_ROW>

export type DelayStep = AutomationStepSchema<AutomationActionStepId.DELAY>

export type DeleteRowStep =
  AutomationStepSchema<AutomationActionStepId.DELETE_ROW>

export type ExecuteQueryStep =
  AutomationStepSchema<AutomationActionStepId.EXECUTE_QUERY>

export type ExecuteScriptStep =
  AutomationStepSchema<AutomationActionStepId.EXECUTE_SCRIPT>

export type ExecuteScriptV2Step =
  AutomationStepSchema<AutomationActionStepId.EXECUTE_SCRIPT_V2>

export type FilterStep = AutomationStepSchema<AutomationActionStepId.FILTER>

export type QueryRowsStep =
  AutomationStepSchema<AutomationActionStepId.QUERY_ROWS>

export type SendEmailSmtpStep =
  AutomationStepSchema<AutomationActionStepId.SEND_EMAIL_SMTP>

export type ServerLogStep =
  AutomationStepSchema<AutomationActionStepId.SERVER_LOG>

export type TriggerAutomationRunStep =
  AutomationStepSchema<AutomationActionStepId.TRIGGER_AUTOMATION_RUN>

export type UpdateRowStep =
  AutomationStepSchema<AutomationActionStepId.UPDATE_ROW>

export type OutgoingWebhookStep =
  AutomationStepSchema<AutomationActionStepId.OUTGOING_WEBHOOK>

export type DiscordStep = AutomationStepSchema<AutomationActionStepId.discord>

export type SlackStep = AutomationStepSchema<AutomationActionStepId.slack>

export type ZapierStep = AutomationStepSchema<AutomationActionStepId.zapier>

export type IntegromatStep =
  AutomationStepSchema<AutomationActionStepId.integromat>

export type N8nStep = AutomationStepSchema<AutomationActionStepId.n8n>

export type ExecuteBashStep =
  AutomationStepSchema<AutomationActionStepId.EXECUTE_BASH>

export type OpenAIStep = AutomationStepSchema<AutomationActionStepId.OPENAI>

export type LoopStep = AutomationStepSchema<AutomationActionStepId.LOOP>

export type BranchStep = AutomationStepSchema<AutomationActionStepId.BRANCH>
export type AutomationStep =
  | CollectStep
  | CreateRowStep
  | DelayStep
  | DeleteRowStep
  | ExecuteQueryStep
  | ExecuteScriptStep
  | ExecuteScriptV2Step
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
  | BranchStep

export function isBranchStep(
  step: AutomationStep | AutomationTrigger
): step is BranchStep {
  return step.stepId === AutomationActionStepId.BRANCH
}

export function isTrigger(
  step: AutomationStep | AutomationTrigger
): step is AutomationTrigger {
  return step.type === AutomationStepType.TRIGGER
}

export function isRowUpdateTrigger(
  step: AutomationStep | AutomationTrigger
): step is RowUpdatedTrigger {
  return step.stepId === AutomationTriggerStepId.ROW_UPDATED
}

export function isRowSaveTrigger(
  step: AutomationStep | AutomationTrigger
): step is RowSavedTrigger {
  return step.stepId === AutomationTriggerStepId.ROW_SAVED
}

export function isAppTrigger(
  step: AutomationStep | AutomationTrigger
): step is AppActionTrigger {
  return step.stepId === AutomationTriggerStepId.APP
}

type EmptyInputs = {}
export type AutomationStepDefinition = Omit<AutomationStep, "id" | "inputs"> & {
  inputs: EmptyInputs
  deprecated?: boolean
}

export type AutomationTriggerDefinition = Omit<
  AutomationTrigger,
  "id" | "inputs"
> & {
  inputs: EmptyInputs
  deprecated?: boolean
}

export type AutomationTriggerInputs<T extends AutomationTriggerStepId> =
  T extends AutomationTriggerStepId.APP
    ? void | Record<string, any>
    : T extends AutomationTriggerStepId.CRON
    ? CronTriggerInputs
    : T extends AutomationTriggerStepId.ROW_ACTION
    ? Record<string, any>
    : T extends AutomationTriggerStepId.ROW_DELETED
    ? RowDeletedTriggerInputs
    : T extends AutomationTriggerStepId.ROW_SAVED
    ? RowCreatedTriggerInputs
    : T extends AutomationTriggerStepId.ROW_UPDATED
    ? RowUpdatedTriggerInputs
    : T extends AutomationTriggerStepId.WEBHOOK
    ? Record<string, any>
    : never

export type AutomationTriggerOutputs<T extends AutomationTriggerStepId> =
  T extends AutomationTriggerStepId.APP
    ? AppActionTriggerOutputs
    : T extends AutomationTriggerStepId.CRON
    ? CronTriggerOutputs
    : T extends AutomationTriggerStepId.ROW_ACTION
    ? Record<string, any>
    : T extends AutomationTriggerStepId.ROW_DELETED
    ? RowDeletedTriggerOutputs
    : T extends AutomationTriggerStepId.ROW_SAVED
    ? RowCreatedTriggerOutputs
    : T extends AutomationTriggerStepId.ROW_UPDATED
    ? RowUpdatedTriggerOutputs
    : T extends AutomationTriggerStepId.WEBHOOK
    ? WebhookTriggerOutputs
    : never

export interface AutomationTriggerSchema<
  TTrigger extends AutomationTriggerStepId
> extends AutomationStepSchemaBase {
  id: string
  type: AutomationStepType.TRIGGER
  event?: AutomationEventType
  cronJobId?: string
  stepId: TTrigger
  inputs: AutomationTriggerInputs<TTrigger> & Record<string, any> // The record union to be removed once the types are fixed
}

export type AutomationTrigger =
  | AppActionTrigger
  | CronTrigger
  | RowActionTrigger
  | RowDeletedTrigger
  | RowSavedTrigger
  | RowUpdatedTrigger
  | WebhookTrigger

export type AppActionTrigger =
  AutomationTriggerSchema<AutomationTriggerStepId.APP>

export type CronTrigger = AutomationTriggerSchema<AutomationTriggerStepId.CRON>

export type RowActionTrigger =
  AutomationTriggerSchema<AutomationTriggerStepId.ROW_ACTION>

export type RowDeletedTrigger =
  AutomationTriggerSchema<AutomationTriggerStepId.ROW_DELETED>

export type RowSavedTrigger =
  AutomationTriggerSchema<AutomationTriggerStepId.ROW_SAVED>

export type RowUpdatedTrigger =
  AutomationTriggerSchema<AutomationTriggerStepId.ROW_UPDATED>

export type WebhookTrigger =
  AutomationTriggerSchema<AutomationTriggerStepId.WEBHOOK>
