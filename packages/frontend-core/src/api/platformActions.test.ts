// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type {
  FetchActionSessionEventsResponse,
  FetchActionSessionsResponse,
} from "@budibase/types"
import { createAPIClient } from "./index"

const pagination = { hasNextPage: false, hasPreviousPage: false }

const sessionsResponse: FetchActionSessionsResponse = {
  sessions: [],
  summary: { total: 0, active: 0, waiting: 0, completed: 0, failed: 0 },
  pagination,
}

const eventsResponse: FetchActionSessionEventsResponse = {
  events: [],
  summary: { total: 0 },
  pagination,
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

describe("platform action endpoints", () => {
  const fetchMock = vi.fn()

  const requestedUrl = () => fetchMock.mock.calls[0][0]

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe("fetchActionSessions", () => {
    it("requests sessions without a query when no options are given", async () => {
      fetchMock.mockResolvedValue(jsonResponse(sessionsResponse))

      const response = await createAPIClient().fetchActionSessions()

      expect(requestedUrl()).toBe("/api/actions/sessions")
      expect(response).toEqual(sessionsResponse)
    })

    it("encodes every provided query option", async () => {
      fetchMock.mockResolvedValue(jsonResponse(sessionsResponse))

      await createAPIClient().fetchActionSessions({
        env: "prod",
        status: "failed",
        limit: 20,
        bookmark: "a+b/c=",
      })

      expect(requestedUrl()).toBe(
        "/api/actions/sessions?env=prod&status=failed&limit=20&bookmark=a%2Bb%2Fc%3D"
      )
    })
  })

  describe("fetchActionSessionEvents", () => {
    it("encodes the session identity in the path and the query options", async () => {
      fetchMock.mockResolvedValue(jsonResponse(eventsResponse))

      const response = await createAPIClient().fetchActionSessionEvents({
        sourceType: "automation_run",
        sourceId: "run/1?x=#2",
        env: "dev",
        limit: 50,
        bookmark: "next",
      })

      expect(requestedUrl()).toBe(
        "/api/actions/sessions/automation_run/run%2F1%3Fx%3D%232/events?env=dev&limit=50&bookmark=next"
      )
      expect(response).toEqual(eventsResponse)
    })

    it("rejects with the server error message", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({ message: "Session not found" }, 404)
      )

      await expect(
        createAPIClient().fetchActionSessionEvents({
          sourceType: "agent_session",
          sourceId: "session-1",
          env: "prod",
        })
      ).rejects.toMatchObject({ status: 404, message: "Session not found" })
    })
  })
})
