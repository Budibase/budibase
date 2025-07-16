import {
  AutomationActionStepId,
  AutomationStepDefinition,
} from "@budibase/types"

import * as bash from "./bash"
import * as branch from "./branch"
import * as collect from "./collect"
import * as createRow from "./createRow"
import * as delay from "./delay"
import * as deleteRow from "./deleteRow"
import * as discord from "./discord"
import * as executeQuery from "./executeQuery"
import * as executeScript from "./executeScript"
import * as executeScriptV2 from "./executeScriptV2"
import * as filter from "./filter"
import * as loop from "./loop"
import * as make from "./make"
import * as n8n from "./n8n"
import * as openai from "./openai"
import * as outgoingWebhook from "./outgoingWebhook"
import * as queryRows from "./queryRows"
import * as sendSmtpEmail from "./sendSmtpEmail"
import * as serverLog from "./serverLog"
import * as slack from "./slack"
import * as triggerAutomationRun from "./triggerAutomationRun"
import * as updateRow from "./updateRow"
import * as zapier from "./zapier"
import * as apiRequest from "./apiRequest"
import * as classifyText from "./ai/classify"
import * as promptLLM from "./ai/promptLLM"
import * as translate from "./ai/translate"
import * as summarise from "./ai/summarise"
import * as generate from "./ai/generate"
import * as extract from "./ai/extract"

export {
  bash,
  branch,
  collect,
  createRow,
  delay,
  deleteRow,
  discord,
  executeQuery,
  executeScript,
  executeScriptV2,
  filter,
  loop,
  make,
  n8n,
  openai,
  outgoingWebhook,
  queryRows,
  sendSmtpEmail,
  serverLog,
  slack,
  triggerAutomationRun,
  updateRow,
  zapier,
  apiRequest,
  classifyText,
  promptLLM,
  translate,
  summarise,
  generate,
  extract,
}

export const definitions: Record<
  keyof typeof AutomationActionStepId,
  AutomationStepDefinition
> = {
  EXECUTE_BASH: bash.definition,
  SEND_EMAIL_SMTP: sendSmtpEmail.definition,
  CREATE_ROW: createRow.definition,
  UPDATE_ROW: updateRow.definition,
  DELETE_ROW: deleteRow.definition,
  OUTGOING_WEBHOOK: outgoingWebhook.definition,
  EXECUTE_SCRIPT: executeScript.definition,
  EXECUTE_SCRIPT_V2: executeScriptV2.definition,
  EXECUTE_QUERY: executeQuery.definition,
  SERVER_LOG: serverLog.definition,
  DELAY: delay.definition,
  FILTER: filter.definition,
  QUERY_ROWS: queryRows.definition,
  LOOP: loop.definition,
  COLLECT: collect.definition,
  OPENAI: openai.definition,
  TRIGGER_AUTOMATION_RUN: triggerAutomationRun.definition,
  BRANCH: branch.definition,
  discord: discord.definition,
  slack: slack.definition,
  zapier: zapier.definition,
  integromat: make.definition,
  n8n: n8n.definition,
  API_REQUEST: apiRequest.definition,
  CLASSIFY_CONTENT: classifyText.definition,
  PROMPT_LLM: promptLLM.definition,
  TRANSLATE: translate.definition,
  SUMMARISE: summarise.definition,
  GENERATE_TEXT: generate.definition,
  EXTRACT_FILE_DATA: extract.definition,
}
