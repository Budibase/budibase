import * as exportWorkspaces from "./exports"
import * as importWorkspaces from "./imports"
import * as statistics from "./statistics"
import * as errors from "./errors"

export default {
  ...exportWorkspaces,
  ...importWorkspaces,
  ...statistics,
  ...errors,
}
