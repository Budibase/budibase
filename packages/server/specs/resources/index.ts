import application from "./application"
import metrics from "./metrics"
import misc from "./misc"
import query from "./query"
import roles from "./roles"
import row from "./row"
import table from "./table"
import user from "./user"

export const examples = {
  ...application.getExamples(),
  ...row.getExamples(),
  ...table.getExamples(),
  ...query.getExamples(),
  ...user.getExamples(),
  ...misc.getExamples(),
  ...metrics.getExamples(),
}

export const schemas = {
  ...application.getSchemas(),
  ...row.getSchemas(),
  ...table.getSchemas(),
  ...query.getSchemas(),
  ...user.getSchemas(),
  ...misc.getSchemas(),
  ...roles.getSchemas(),
}
