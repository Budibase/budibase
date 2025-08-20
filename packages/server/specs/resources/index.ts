import workspace from "./workspace"
import row from "./row"
import table from "./table"
import query from "./query"
import user from "./user"
import metrics from "./metrics"
import misc from "./misc"
import roles from "./roles"
import view from "./view"

export const examples = {
  ...workspace.getExamples(),
  ...row.getExamples(),
  ...table.getExamples(),
  ...query.getExamples(),
  ...user.getExamples(),
  ...misc.getExamples(),
  ...metrics.getExamples(),
  ...roles.getExamples(),
  ...view.getExamples(),
}

export const schemas = {
  ...workspace.getSchemas(),
  ...row.getSchemas(),
  ...table.getSchemas(),
  ...query.getSchemas(),
  ...user.getSchemas(),
  ...misc.getSchemas(),
  ...roles.getSchemas(),
  ...view.getSchemas(),
}
