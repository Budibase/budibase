import { beforeEach, describe, expect, it, vi } from "vitest"
import type {
  FetchActionSessionEventsResponse,
  FetchActionSessionsResponse,
} from "@budibase/types"
import { buildPlatformActionEndpoints } from "./platformActions"
import type { BaseAPIClient } from "./types"

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

describe("platform action endpoints", () => {
  const get = vi.fn()
  const client: BaseAPIClient = {
    get,
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    invalidateCache: vi.fn(),
    getAppID: vi.fn(),
  }
  const endpoints = buildPlatformActionEndpoints(client)

  const requestedUrl = () => get.mock.calls[0][0].url

  beforeEach(() => {
    get.mockReset()
  })

  describe("fetchActionSessions", () => {
    it("requests sessions without a query when no options are given", async () => {
      get.mockResolvedValue(sessionsResponse)

      const response = await endpoints.fetchActionSessions()

      expect(requestedUrl()).toBe("/api/actions/sessions")
      expect(response).toEqual(sessionsResponse)
    })

    it("encodes every provided query option", async () => {
      get.mockResolvedValue(sessionsResponse)

      await endpoints.fetchActionSessions({
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
      get.mockResolvedValue(eventsResponse)

      const response = await endpoints.fetchActionSessionEvents({
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

    it("propagates errors from the HTTP client", async () => {
      const error = { status: 404, message: "Session not found" }
      get.mockRejectedValue(error)

      await expect(
        endpoints.fetchActionSessionEvents({
          sourceType: "agent_session",
          sourceId: "session-1",
          env: "prod",
        })
      ).rejects.toBe(error)
    })
  })
})
