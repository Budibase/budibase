import fetch from "node-fetch"
import { context } from "@budibase/backend-core"
import { getAvailableTools, getOrThrow } from "./agents"
import { AGENT_LOG_SESSION_TABLE_ID } from "../sqs/staticTables"
import {
  fetchRequestDetail,
  fetchSessionDetail,
  addSessionLog,
} from "./agentLogs"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: jest.fn(),
    },
  }
})

jest.mock("node-fetch", () => jest.fn())
jest.mock("./agents", () => ({
  getAvailableTools: jest.fn(),
  getOrThrow: jest.fn(),
  getToolDisplayNames: jest.fn().mockReturnValue({}),
}))
jest.mock("../tables/internal/sqs", () => ({
  ensureStaticTables: jest.fn().mockResolvedValue(undefined),
}))

interface InMemoryDoc {
  _id: string
  _rev?: string
  [key: string]: any
}

function createInMemoryDb() {
  const docs = new Map<string, InMemoryDoc>()

  return {
    docs,
    tryGet: jest.fn(async (id: string) => docs.get(id)),
    put: jest.fn(async (doc: InMemoryDoc) => {
      const existing = docs.get(doc._id)

      if (existing) {
        if (!doc._rev || doc._rev !== existing._rev) {
          const error: any = new Error("conflict")
          error.status = 409
          throw error
        }
      }

      const currentRev = existing?._rev ? Number.parseInt(existing._rev, 10) : 0
      const nextRev = String(currentRev + 1)
      const stored = { ...doc, _rev: nextRev }
      docs.set(doc._id, stored)
      return {
        ok: true,
        id: doc._id,
        rev: nextRev,
      }
    }),
    sql: jest.fn(
      async (_query: string, _bindings: any[]) => [] as InMemoryDoc[]
    ),
  }
}

function liteLLMSummaryResponse({
  requestId,
  user = "bb-agent:agent-1",
}: {
  requestId: string
  user?: string
}) {
  return {
    ok: true,
    json: jest.fn().mockResolvedValue({
      data: [
        {
          request_id: requestId,
          model: "gpt-5",
          prompt_tokens: 10,
          completion_tokens: 20,
          spend: 0.01,
          status: "success",
          startTime: "2026-03-08T10:00:00.000Z",
          endTime: "2026-03-08T10:00:10.000Z",
          user: "default_user_id",
          end_user: user,
          metadata: {},
        },
      ],
    }),
  } as any
}

function liteLLMPayloadResponse({
  requestId = "req-1",
  user = "bb-agent:agent-1",
}: {
  requestId?: string
  user?: string
}) {
  return {
    ok: true,
    json: jest.fn().mockResolvedValue({
      proxy_server_request: {
        user,
        model: "gpt-5",
        messages: [
          {
            role: "user",
            content: "Question",
          },
        ],
      },
      response: {
        request_id: requestId,
        model: "gpt-5",
        choices: [{ message: { content: "ok" } }],
      },
    }),
  } as any
}

function liteLLMSessionResponse(
  rows: Array<{
    request_id: string
    startTime: string
    endTime: string
    prompt_tokens?: number
    completion_tokens?: number
    spend?: number
    model?: string
    end_user?: string
    status?: string
    session_id?: string
  }>
) {
  return {
    ok: true,
    json: jest.fn().mockResolvedValue({
      data: rows,
      total: rows.length,
      total_pages: 1,
    }),
  } as any
}

describe("agentLogs", () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>
  const mockGetWorkspaceDB = context.getWorkspaceDB as jest.MockedFunction<
    typeof context.getWorkspaceDB
  >
  const getAvailableToolsMock = getAvailableTools as jest.MockedFunction<
    typeof getAvailableTools
  >
  const getOrThrowMock = getOrThrow as jest.MockedFunction<typeof getOrThrow>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWorkspaceDB.mockReset()
    fetchMock.mockImplementation(async (url: any) => {
      const path = String(url)
      if (path.includes("/spend/logs/v2")) {
        return liteLLMSummaryResponse({ requestId: "req-1" })
      }
      if (path.includes("/spend/logs/session/ui")) {
        return liteLLMSessionResponse([])
      }
      if (path.includes("/spend/logs/ui/")) {
        return liteLLMPayloadResponse({ requestId: "req-1" })
      }
      return {
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      } as any
    })
    getAvailableToolsMock.mockResolvedValue([])
    getOrThrowMock.mockResolvedValue({
      _id: "agent-1",
      aiconfig: "config-1",
    } as Awaited<ReturnType<typeof getOrThrow>>)
  })

  it("indexes request/session docs idempotently", async () => {
    const db = createInMemoryDb()
    mockGetWorkspaceDB.mockReturnValue(db as any)
    fetchMock.mockResolvedValue(liteLLMSummaryResponse({ requestId: "req-1" }))

    await addSessionLog({
      agentId: "agent-1",
      sessionId: "chatconvo_1",
      requestIds: ["req-1"],
      firstInput: "Hello",
      startedAt: "2026-03-08T09:00:00.000Z",
      completedAt: "2026-03-08T09:00:10.000Z",
    })
    await addSessionLog({
      agentId: "agent-1",
      sessionId: "chatconvo_1",
      requestIds: ["req-1"],
      firstInput: "Hello",
      startedAt: "2026-03-08T09:00:00.000Z",
      completedAt: "2026-03-08T09:00:10.000Z",
    })

    const sessionDocs = [...db.docs.values()].filter(
      doc => doc.tableId === AGENT_LOG_SESSION_TABLE_ID
    )

    expect(sessionDocs).toHaveLength(1)
    expect(sessionDocs[0]).toEqual(
      expect.objectContaining({
        sessionId: "chatconvo_1",
        operations: 1,
        trigger: "Chat",
        requestIds: JSON.stringify(["req-1"]),
      })
    )
    const summaryUrl = new URL(String(fetchMock.mock.calls[0]?.[0]))
    expect(summaryUrl.pathname).toContain("/spend/logs/v2")
    expect(summaryUrl.searchParams.get("start_date")).toBe(
      "2026-03-08 00:00:00"
    )
    expect(summaryUrl.searchParams.get("end_date")).toBe("2026-03-08 23:59:59")
  })

  it("returns session detail entries in chronological order", async () => {
    const db = createInMemoryDb()
    mockGetWorkspaceDB.mockReturnValue(db as any)

    db.tryGet.mockResolvedValue({
      _id: "session-1",
      tableId: AGENT_LOG_SESSION_TABLE_ID,
      type: "agent_log_session",
      agentId: "agent-1",
      sessionId: "session-chronological",
      trigger: "Automation",
      isPreview: false,
      firstInput: "",
      startTime: "2026-03-08T10:00:00.000Z",
      lastActivityAt: "2026-03-08T11:00:10.000Z",
      requestIds: JSON.stringify(["req-old", "req-new"]),
      operations: 2,
      status: "success",
    })
    fetchMock.mockImplementation(async (url: any) => {
      const path = String(url)
      if (path.includes("/spend/logs/session/ui")) {
        return liteLLMSessionResponse([
          {
            request_id: "req-new",
            session_id: "session-chronological",
            startTime: "2026-03-08T11:00:00.000Z",
            endTime: "2026-03-08T11:00:10.000Z",
            prompt_tokens: 10,
            completion_tokens: 20,
            spend: 0.01,
            model: "gpt-5",
            end_user: "bb-agent:agent-1",
            status: "success",
          },
          {
            request_id: "req-old",
            session_id: "session-chronological",
            startTime: "2026-03-08T10:00:00.000Z",
            endTime: "2026-03-08T10:00:10.000Z",
            prompt_tokens: 10,
            completion_tokens: 20,
            spend: 0.01,
            model: "gpt-5",
            end_user: "bb-agent:agent-1",
            status: "success",
          },
        ])
      }
      if (path.includes("/spend/logs/v2")) {
        return liteLLMSummaryResponse({ requestId: "req-1" })
      }
      if (path.includes("/spend/logs/ui/")) {
        return liteLLMPayloadResponse({ requestId: "req-1" })
      }
      return {
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      } as any
    })

    const detail = await fetchSessionDetail("agent-1", "session-chronological")
    expect(detail?.entries.map(entry => entry.requestId)).toEqual([
      "req-old",
      "req-new",
    ])
  })

  it("rejects request detail when the returned user belongs to another agent", async () => {
    const db = createInMemoryDb()
    mockGetWorkspaceDB.mockReturnValue(db as any)
    fetchMock.mockResolvedValue(
      liteLLMPayloadResponse({
        requestId: "req-1",
        user: "bb-agent:agent-2",
      })
    )

    await expect(fetchRequestDetail("agent-1", "req-1")).rejects.toMatchObject({
      status: 404,
      message: "Agent log detail not found",
    })
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "/spend/logs/ui/req-1"
    )
  })

  it("returns not found when LiteLLM does not return request detail", async () => {
    const db = createInMemoryDb()
    mockGetWorkspaceDB.mockReturnValue(db as any)
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(null),
    } as any)

    await expect(
      fetchRequestDetail("agent-1", "req-missing")
    ).rejects.toMatchObject({
      status: 404,
      message: "Agent log detail not found",
    })
  })
})
