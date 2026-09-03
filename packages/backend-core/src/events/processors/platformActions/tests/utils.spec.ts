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

      expect(id).toBe("platform_action_session_agent_session_session-1")
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

      expect(id).toBe("platform_action_session_agent_session_a%2Fb%20c")
    })
  })

  describe("buildPlatformActionSession", () => {
    it("initialises a fresh session doc with actionCount 1", () => {
      const doc = buildPlatformActionSession({
        sourceType: "agent_session",
        sourceId: "session-1",
        status: "completed",
        startedAt: "2026-08-31T00:00:00.000Z",
        statusUpdatedAt: "2026-08-31T00:00:00.000Z",
        actionCount: 1,
      })

      // updatedAt is deliberately absent: db.put() always stamps it with
      // the real write time, so the builder doesn't set it at all.
      expect(doc).toEqual({
        _id: getPlatformActionSessionId({
          sourceType: "agent_session",
          sourceId: "session-1",
        }),
        actionCount: 1,
        sourceType: "agent_session",
        sourceId: "session-1",
        status: "completed",
        startedAt: "2026-08-31T00:00:00.000Z",
        statusUpdatedAt: "2026-08-31T00:00:00.000Z",
      })
      expect(doc).not.toHaveProperty("updatedAt")
    })

    it("carries through optional asset/triggeredBy fields when provided", () => {
      const doc = buildPlatformActionSession({
        sourceType: "automation_run",
        sourceId: "run-1",
        status: "failed",
        startedAt: "2026-08-31T00:00:00.000Z",
        statusUpdatedAt: "2026-08-31T00:00:00.000Z",
        actionCount: 1,
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
