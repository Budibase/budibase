import { automations } from "@budibase/shared-core"
import * as sendSmtpEmail from "./steps/sendSmtpEmail"
import * as createRow from "./steps/createRow"
import * as updateRow from "./steps/updateRow"
import * as deleteRow from "./steps/deleteRow"
import * as executeScript from "./steps/executeScript"
import * as executeScriptV2 from "./steps/executeScriptV2"
import * as executeQuery from "./steps/executeQuery"
import * as outgoingWebhook from "./steps/outgoingWebhook"
import * as serverLog from "./steps/serverLog"
import * as discord from "./steps/discord"
import * as slack from "./steps/slack"
import * as zapier from "./steps/zapier"
import * as n8n from "./steps/n8n"
import * as make from "./steps/make"
import * as filter from "./steps/filter"
import * as delay from "./steps/delay"
import * as queryRow from "./steps/queryRows"
import * as collect from "./steps/collect"
import * as triggerAutomationRun from "./steps/triggerAutomationRun"
import * as openai from "./steps/openai"
import * as bash from "./steps/bash"
import env from "../environment"
import {
  PluginType,
  AutomationActionStepId,
  ActionImplementations,
  Hosting,
  ActionImplementation,
  AutomationStepDefinition,
  AutomationStepInputs,
  AutomationStepOutputs,
} from "@budibase/types"
import sdk from "../sdk"
import { getAutomationPlugin } from "../utilities/fileSystem"

type ActionImplType = ActionImplementations<
  typeof env.SELF_HOSTED extends "true" ? Hosting.SELF : Hosting.CLOUD
>

const ACTION_IMPLS: ActionImplType = {
  SEND_EMAIL_SMTP: sendSmtpEmail.run,
  CREATE_ROW: createRow.run,
  UPDATE_ROW: updateRow.run,
  DELETE_ROW: deleteRow.run,
  OUTGOING_WEBHOOK: outgoingWebhook.run,
  EXECUTE_SCRIPT: executeScript.run,
  EXECUTE_SCRIPT_V2: executeScriptV2.run,
  EXECUTE_QUERY: executeQuery.run,
  SERVER_LOG: serverLog.run,
  DELAY: delay.run,
  FILTER: filter.run,
  QUERY_ROWS: queryRow.run,
  COLLECT: collect.run,
  TRIGGER_AUTOMATION_RUN: triggerAutomationRun.run,
  OPENAI: openai.run,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.run,
  slack: slack.run,
  zapier: zapier.run,
  integromat: make.run,
  n8n: n8n.run,
}

export const BUILTIN_ACTION_DEFINITIONS: Record<
  string,
  AutomationStepDefinition
> = {
  SEND_EMAIL_SMTP: automations.steps.sendSmtpEmail.definition,
  CREATE_ROW: automations.steps.createRow.definition,
  UPDATE_ROW: automations.steps.updateRow.definition,
  DELETE_ROW: automations.steps.deleteRow.definition,
  OUTGOING_WEBHOOK: automations.steps.outgoingWebhook.definition,
  EXECUTE_SCRIPT: automations.steps.executeScript.definition,
  EXECUTE_SCRIPT_V2: automations.steps.executeScriptV2.definition,
  EXECUTE_QUERY: automations.steps.executeQuery.definition,
  SERVER_LOG: automations.steps.serverLog.definition,
  DELAY: automations.steps.delay.definition,
  FILTER: automations.steps.filter.definition,
  QUERY_ROWS: automations.steps.queryRows.definition,
  LOOP: automations.steps.loop.definition,
  COLLECT: automations.steps.collect.definition,
  TRIGGER_AUTOMATION_RUN: automations.steps.triggerAutomationRun.definition,
  BRANCH: automations.steps.branch.definition,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: automations.steps.discord.definition,
  slack: automations.steps.slack.definition,
  zapier: automations.steps.zapier.definition,
  integromat: automations.steps.make.definition,
  n8n: automations.steps.n8n.definition,
}

// don't add the bash script/definitions unless in self host
// the fact this isn't included in any definitions means it cannot be
// ran at all
if (env.SELF_HOSTED) {
  // @ts-expect-error
  ACTION_IMPLS["EXECUTE_BASH"] = bash.run
  BUILTIN_ACTION_DEFINITIONS["EXECUTE_BASH"] = automations.steps.bash.definition

  if (env.isTest()) {
    BUILTIN_ACTION_DEFINITIONS["OPENAI"] = automations.steps.openai.definition
  }
}

export async function getActionDefinitions(): Promise<
  Record<keyof typeof AutomationActionStepId, AutomationStepDefinition>
> {
  if (env.SELF_HOSTED) {
    BUILTIN_ACTION_DEFINITIONS["OPENAI"] = automations.steps.openai.definition
  }

  const actionDefinitions = BUILTIN_ACTION_DEFINITIONS
  if (env.SELF_HOSTED) {
    const plugins = await sdk.plugins.fetch(PluginType.AUTOMATION)
    for (let plugin of plugins) {
      const schema = plugin.schema.schema as AutomationStepDefinition
      actionDefinitions[schema.stepId] = {
        ...schema,
        custom: true,
      }
    }
  }
  return actionDefinitions
}

/* istanbul ignore next */
export async function getAction<
  TStep extends AutomationActionStepId,
  TInputs = AutomationStepInputs<TStep>,
  TOutputs = AutomationStepOutputs<TStep>
>(stepId: TStep): Promise<ActionImplementation<TInputs, TOutputs> | undefined> {
  if (ACTION_IMPLS[stepId as keyof ActionImplType] != null) {
    return ACTION_IMPLS[
      stepId as keyof ActionImplType
    ] as unknown as ActionImplementation<TInputs, TOutputs>
  }

  // must be a plugin
  if (env.SELF_HOSTED) {
    const plugins = await sdk.plugins.fetch(PluginType.AUTOMATION)
    const found = plugins.find(plugin => plugin.schema.schema.stepId === stepId)
    if (!found) {
      throw new Error(`Unable to find action implementation for "${stepId}"`)
    }
    return (await getAutomationPlugin(found)).action
  }
}
