export const TriggerStepID = {
  ROW_SAVED: "ROW_SAVED",
  ROW_UPDATED: "ROW_UPDATED",
  ROW_DELETED: "ROW_DELETED",
  ROW_ACTION: "ROW_ACTION",
  WEBHOOK: "WEBHOOK",
  APP: "APP",
  CRON: "CRON",
}

export const ActionStepID = {
  SEND_EMAIL_SMTP: "SEND_EMAIL_SMTP",
  CREATE_ROW: "CREATE_ROW",
  UPDATE_ROW: "UPDATE_ROW",
  DELETE_ROW: "DELETE_ROW",
  OUTGOING_WEBHOOK: "OUTGOING_WEBHOOK",
  EXECUTE_SCRIPT: "EXECUTE_SCRIPT",
  EXECUTE_QUERY: "EXECUTE_QUERY",
  SERVER_LOG: "SERVER_LOG",
  DELAY: "DELAY",
  FILTER: "FILTER",
  QUERY_ROWS: "QUERY_ROWS",
  LOOP: "LOOP",
  COLLECT: "COLLECT",
  TRIGGER_AUTOMATION_RUN: "TRIGGER_AUTOMATION_RUN",
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: "discord",
  slack: "slack",
  zapier: "zapier",
  integromat: "integromat",
  n8n: "n8n",
}

export const Features = {
  LOOPING: "LOOPING",
}
