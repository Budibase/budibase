import * as app from "./app"
import * as cron from "./cron"
import * as rowDeleted from "./rowDeleted"
import * as rowSaved from "./rowSaved"
import * as rowUpdated from "./rowUpdated"
import * as webhook from "./webhook"

export const definitions = {
  ROW_SAVED: rowSaved.definition,
  ROW_UPDATED: rowUpdated.definition,
  ROW_DELETED: rowDeleted.definition,
  WEBHOOK: webhook.definition,
  APP: app.definition,
  CRON: cron.definition,
}
