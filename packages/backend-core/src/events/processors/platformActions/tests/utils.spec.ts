import { DocumentType, SEPARATOR } from "@budibase/types"
import {
  buildPlatformActionSession,
  getPlatformActionSessionId,
} from "../utils"

describe("platformActions utils", () => {
  describe("getPlatformActionSessionId", () => {
    it("builds a deterministic id from sourceType and sourceId", () => {
      const id = getPlatformActionSessionId({
        sourceType: "agent_session",
        sourceId: "session-1",
      })

      expect(id).toBe(
        `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}agent_session${SEPARATOR}session-1`
      )
    })

    it("is stable for the same source across calls", () => {
      const input = {
        sourceType: "automation_run" as const,
        sourceId: "run-1",
      }

      expect(getPlatformActionSessionId(input)).toBe(
        getPlatformActionSessionId(input)
      )
    })

    it("percent-encodes characters that would otherwise break the id shape", () => {
      const id = getPlatformActionSessionId({
        sourceType: "agent_session",
        sourceId: "a/b c",
      })

      expect(id).toBe(
        `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}agent_session${SEPARATOR}a%2Fb%20c`
      )
    })
  })

  describe("buildPlatformActionSession", () => {
    it("initialises a fresh session doc with actionCount 1", () => {
      const doc = buildPlatformActionSession({
        sourceType: "agent_session",
        sourceId: "session-1",
        status: "completed",
        startedAt: "2026-08-31T00:00:00.000Z",
      })

      expect(doc).toEqual({
        _id: getPlatformActionSessionId({
          sourceType: "agent_session",
          sourceId: "session-1",
        }),
        actionCount: 1,
        updatedAt: "2026-08-31T00:00:00.000Z",
        sourceType: "agent_session",
        sourceId: "session-1",
        status: "completed",
        startedAt: "2026-08-31T00:00:00.000Z",
      })
    })

    it("carries through optional asset/triggeredBy fields when provided", () => {
      const doc = buildPlatformActionSession({
        sourceType: "automation_run",
        sourceId: "run-1",
        status: "failed",
        startedAt: "2026-08-31T00:00:00.000Z",
        assetType: "automation",
        assetId: "automation-1",
        assetLabel: "My automation",
        triggeredByType: "user",
        triggeredById: "user-1",
        triggeredByLabel: "Jane",
      })

      expect(doc).toMatchObject({
        assetType: "automation",
        assetId: "automation-1",
        assetLabel: "My automation",
        triggeredByType: "user",
        triggeredById: "user-1",
        triggeredByLabel: "Jane",
      })
    })
  })
})
