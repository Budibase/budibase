import { DocumentType, SEPARATOR } from "@budibase/types"
import {
  AGENT_LOG_SESSION_PREFIX,
  AUTOMATION_LOG_PREFIX,
  FUNCTION_RUN_LOG_PREFIX,
  LINK_USER_METADATA_PREFIX,
  TABLE_ROW_PREFIX,
  USER_METDATA_PREFIX,
} from "../../../db/utils"

export const createWorkspaceExportFilter = (excludeRows?: boolean) => {
  const excludedIds = [
    USER_METDATA_PREFIX,
    LINK_USER_METADATA_PREFIX,
    AUTOMATION_LOG_PREFIX,
    AGENT_LOG_SESSION_PREFIX,
    FUNCTION_RUN_LOG_PREFIX,
    `${DocumentType.SLACK_APP_CONFIG}${SEPARATOR}`,
  ]
  if (excludeRows) {
    excludedIds.push(TABLE_ROW_PREFIX)
  }
  return (doc: { _id: string; [key: string]: unknown }) =>
    !excludedIds.some(excludedId => doc._id.includes(excludedId))
}
