import app from "./app"
import cron from "./cron"
import rowDeleted from "./rowDeleted"
import rowSaved from "./rowSaved"
import rowUpdated from "./rowUpdated"
import webhook from "./webhook"

export const definitions = {
  ROW_SAVED: rowSaved.definition,
  ROW_UPDATED: rowUpdated.definition,
  ROW_DELETED: rowDeleted.definition,
  WEBHOOK: webhook.definition,
  APP: app.definition,
  CRON: cron.definition,
}
