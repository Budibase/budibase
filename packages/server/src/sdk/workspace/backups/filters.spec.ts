import { DocumentType, SEPARATOR } from "@budibase/types"
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
})
