import { DocumentType, SEPARATOR } from "@budibase/types"
import { FUNCTION_RUN_LOG_PREFIX } from "../../../db/utils"
import { createWorkspaceExportFilter } from "./filters"

describe("workspace export filter", () => {
  const slackAppConfigId = `${DocumentType.SLACK_APP_CONFIG}${SEPARATOR}config`

  it("excludes Slack app configuration", () => {
    const filter = createWorkspaceExportFilter()

    expect(filter({ _id: slackAppConfigId })).toBe(false)
  })

  it("excludes Slack app configuration tombstones", () => {
    const filter = createWorkspaceExportFilter()

    expect(filter({ _id: slackAppConfigId, _deleted: true })).toBe(false)
  })

  it("excludes Function run logs", () => {
    const filter = createWorkspaceExportFilter()

    expect(filter({ _id: `${FUNCTION_RUN_LOG_PREFIX}test` })).toBe(false)
  })
})
