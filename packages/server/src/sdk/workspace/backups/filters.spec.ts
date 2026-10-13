import { DocumentType, RuntimeDocumentTypes, SEPARATOR } from "@budibase/types"
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

  it.each(RuntimeDocumentTypes)("excludes %s documents", type => {
    const filter = createWorkspaceExportFilter()

    expect(filter({ _id: `${type}${SEPARATOR}id` })).toBe(false)
  })

  it.each(RuntimeDocumentTypes)(
    "keeps documents whose ID only contains %s",
    type => {
      const filter = createWorkspaceExportFilter()

      expect(
        filter({
          _id: `${DocumentType.ROLE}${SEPARATOR}${type}${SEPARATOR}admin`,
        })
      ).toBe(true)
    }
  )
})
