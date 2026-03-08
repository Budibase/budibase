import fetch from "node-fetch"
import { getAvailableTools, getOrThrow } from "./agents"
import {
  fetchRequestDetail,
  fetchSessionDetail,
  fetchSessions,
} from "./agentLogs"

jest.mock("node-fetch", () => jest.fn())
jest.mock("./agents", () => ({
  getAvailableTools: jest.fn(),
  getOrThrow: jest.fn(),
  getToolDisplayNames: jest.fn().mockReturnValue({}),
}))

describe("agentLogs", () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>
  const getAvailableToolsMock = getAvailableTools as jest.MockedFunction<
    typeof getAvailableTools
  >
  const getOrThrowMock = getOrThrow as jest.MockedFunction<typeof getOrThrow>

  beforeEach(() => {
    jest.clearAllMocks()
    getOrThrowMock.mockResolvedValue({
      _id: "agent-1",
      aiconfig: "config-1",
    } as Awaited<ReturnType<typeof getOrThrow>>)
    getAvailableToolsMock.mockResolvedValue([])
  })

  it("uses the UI spend logs endpoint and respects session_total_count", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [
          {
            request_id: "req-1",
            session_id: "session-1",
            model: "gpt-5",
            prompt_tokens: 10,
            completion_tokens: 20,
            spend: 0.1,
            startTime: "2026-03-06T10:00:00.000Z",
            endTime: "2026-03-06T10:00:10.000Z",
            status: "success",
            session_total_count: 3,
          },
        ],
        total_pages: 2,
      }),
    } as any)

    const result = await fetchSessions(
      "agent-1",
      "2026-03-06T09:00:00.000Z",
      "2026-03-06",
      0
    )

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/spend/logs/ui?"),
      expect.anything()
    )
    expect(fetchMock.mock.calls[0]?.[0]).toContain(
      "start_date=2026-03-06+09%3A00%3A00"
    )
    expect(fetchMock.mock.calls[0]?.[0]).toContain(
      "end_date=2026-03-06+23%3A59%3A59"
    )
    expect(fetchMock.mock.calls[0]?.[0]).toContain("page_size=100")
    expect(result.sessions[0]).toEqual(
      expect.objectContaining({
        sessionId: "session-1",
        isPreview: false,
        operations: 3,
      })
    )
    expect(result.hasMore).toBe(true)
  })

  it("marks chat preview sessions so the UI can hide them outside dev", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [
          {
            request_id: "req-1",
            session_id: "chat-preview:session-1",
            model: "gpt-5",
            prompt_tokens: 10,
            completion_tokens: 20,
            spend: 0.1,
            startTime: "2026-03-06T10:00:00.000Z",
            endTime: "2026-03-06T10:00:10.000Z",
            status: "success",
          },
        ],
        total_pages: 1,
      }),
    } as any)

    const result = await fetchSessions(
      "agent-1",
      "2026-03-06T09:00:00.000Z",
      "2026-03-06",
      0
    )

    expect(result.sessions[0]).toEqual(
      expect.objectContaining({
        sessionId: "chat-preview:session-1",
        trigger: "Chat Preview",
        isPreview: true,
      })
    )
  })

  it("fetches all pages for a session detail", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            {
              request_id: "req-1",
              session_id: "session-1",
              end_user: "bb-agent:agent-1",
              model: "gpt-5",
              prompt_tokens: 10,
              completion_tokens: 20,
              spend: 0.1,
              startTime: "2026-03-06T10:00:00.000Z",
              endTime: "2026-03-06T10:00:10.000Z",
              status: "success",
            },
          ],
          total_pages: 2,
        }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            {
              request_id: "req-2",
              session_id: "session-1",
              end_user: "bb-agent:agent-1",
              model: "gpt-5",
              prompt_tokens: 5,
              completion_tokens: 15,
              spend: 0.05,
              startTime: "2026-03-06T10:00:11.000Z",
              endTime: "2026-03-06T10:00:18.000Z",
              status: "failure",
            },
          ],
          total_pages: 2,
        }),
      } as any)

    const session = await fetchSessionDetail("agent-1", "session-1")

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(session).toEqual(
      expect.objectContaining({
        sessionId: "session-1",
        operations: 2,
        status: "error",
      })
    )
    expect(session?.entries.map(entry => entry.requestId)).toEqual([
      "req-1",
      "req-2",
    ])
  })

  it("ignores session detail logs without a matching end_user", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [
          {
            request_id: "req-1",
            session_id: "session-1",
            model: "gpt-5",
            prompt_tokens: 10,
            completion_tokens: 20,
            spend: 0.1,
            startTime: "2026-03-06T10:00:00.000Z",
            endTime: "2026-03-06T10:00:10.000Z",
            status: "success",
          },
        ],
        total_pages: 1,
      }),
    } as any)

    const session = await fetchSessionDetail("agent-1", "session-1")

    expect(session).toBeNull()
  })

  it("rejects request detail when the returned user belongs to another agent", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        request_id: "req-1",
        proxy_server_request: {
          user: "bb-agent:agent-2",
          messages: [],
        },
      }),
    } as any)

    await expect(
      fetchRequestDetail("agent-1", "req-1", "2026-03-06T09:00:00.000Z")
    ).rejects.toMatchObject({
      status: 404,
      message: "Agent log detail not found",
    })
  })
})
