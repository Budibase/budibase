import * as sendSmtpEmail from "./steps/sendSmtpEmail"
import * as createRow from "./steps/createRow"
import * as updateRow from "./steps/updateRow"
import * as deleteRow from "./steps/deleteRow"
import * as executeScript from "./steps/executeScript"
import * as executeQuery from "./steps/executeQuery"
import * as outgoingWebhook from "./steps/outgoingWebhook"
import * as serverLog from "./steps/serverLog"
import * as discord from "./steps/discord"
import * as slack from "./steps/slack"
import * as zapier from "./steps/zapier"
import * as integromat from "./steps/integromat"
import * as filter from "./steps/filter"
import * as delay from "./steps/delay"
import * as queryRow from "./steps/queryRows"
import * as loop from "./steps/loop"
import env from "../environment"
import { AutomationStepSchema, AutomationStepInput } from "@budibase/types"

const ACTION_IMPLS: Record<
  string,
  (opts: AutomationStepInput) => Promise<any>
> = {
  SEND_EMAIL_SMTP: sendSmtpEmail.run,
  CREATE_ROW: createRow.run,
  UPDATE_ROW: updateRow.run,
  DELETE_ROW: deleteRow.run,
  OUTGOING_WEBHOOK: outgoingWebhook.run,
  EXECUTE_SCRIPT: executeScript.run,
  EXECUTE_QUERY: executeQuery.run,
  SERVER_LOG: serverLog.run,
  DELAY: delay.run,
  FILTER: filter.run,
  QUERY_ROWS: queryRow.run,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.run,
  slack: slack.run,
  zapier: zapier.run,
  integromat: integromat.run,
}
export const ACTION_DEFINITIONS: Record<string, AutomationStepSchema> = {
  SEND_EMAIL_SMTP: sendSmtpEmail.definition,
  CREATE_ROW: createRow.definition,
  UPDATE_ROW: updateRow.definition,
  DELETE_ROW: deleteRow.definition,
  OUTGOING_WEBHOOK: outgoingWebhook.definition,
  EXECUTE_SCRIPT: executeScript.definition,
  EXECUTE_QUERY: executeQuery.definition,
  SERVER_LOG: serverLog.definition,
  DELAY: delay.definition,
  FILTER: filter.definition,
  QUERY_ROWS: queryRow.definition,
  LOOP: loop.definition,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.definition,
  slack: slack.definition,
  zapier: zapier.definition,
  integromat: integromat.definition,
}

// don't add the bash script/definitions unless in self host
// the fact this isn't included in any definitions means it cannot be
// ran at all
if (env.SELF_HOSTED) {
  const bash = require("./steps/bash")
  // @ts-ignore
  ACTION_IMPLS["EXECUTE_BASH"] = bash.run
  // @ts-ignore
  ACTION_DEFINITIONS["EXECUTE_BASH"] = bash.definition
}

/* istanbul ignore next */
export async function getAction(actionName: string) {
  if (ACTION_IMPLS[actionName] != null) {
    return ACTION_IMPLS[actionName]
  }
}
