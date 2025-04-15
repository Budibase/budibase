import {
  AutomationTriggerDefinition,
  AutomationTriggerStepId,
} from "@budibase/types"
import * as app from "./app"
import * as cron from "./cron"
import * as rowDeleted from "./rowDeleted"
import * as rowSaved from "./rowSaved"
import * as rowUpdated from "./rowUpdated"
import * as webhook from "./webhook"
import * as rowAction from "./rowAction"

export const definitions: Record<
  keyof typeof AutomationTriggerStepId,
  AutomationTriggerDefinition
> = {
  ROW_SAVED: rowSaved.definition,
  ROW_UPDATED: rowUpdated.definition,
  ROW_DELETED: rowDeleted.definition,
  WEBHOOK: webhook.definition,
  APP: app.definition,
  CRON: cron.definition,
  ROW_ACTION: rowAction.definition,
}
