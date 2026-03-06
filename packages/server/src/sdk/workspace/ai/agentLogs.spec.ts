import fetch from "node-fetch"
import { fetchSessionDetail, fetchSessions } from "./agentLogs"

jest.mock("node-fetch", () => jest.fn())

describe("agentLogs", () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    jest.clearAllMocks()
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
        operations: 3,
      })
    )
    expect(result.hasMore).toBe(true)
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
})
