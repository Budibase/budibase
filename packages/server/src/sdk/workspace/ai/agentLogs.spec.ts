import cloneDeep from "lodash/cloneDeep"
import nock from "nock"
import { constants, context } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { licensing } from "@budibase/pro"
import { AGENT_LOG_SESSION_TABLE_ID } from "../sqs/staticTables"
import environment from "../../../environment"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import type { AgentLogSessionIndexDoc } from "@budibase/types"
import {
  addSessionLog,
  clearOldHistory,
  fetchRequestDetail,
  fetchSessions,
  fetchSessionDetail,
  getExpiredSessions,
  oldestLogDate,
} from "./agentLogs"

function getSessionDocId(agentId: string, sessionId: string): string {
  return `agentlogsession_${encodeURIComponent(agentId)}_${encodeURIComponent(
    sessionId
  )}`
}

function createSessionDoc(
  overrides: Partial<AgentLogSessionIndexDoc> & {
    agentId: string
    sessionId: string
    startTime: string
    lastActivityAt: string
  }
): AgentLogSessionIndexDoc {
  const now = new Date().toISOString()

  return {
    _id: getSessionDocId(overrides.agentId, overrides.sessionId),
    tableId: AGENT_LOG_SESSION_TABLE_ID,
    type: "agent_log_session",
    trigger: "Chat",
    isPreview: false,
    firstInput: "",
    requestIds: JSON.stringify([]),
    operations: 1,
    status: "success",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

function buildLiteLLMSummaryRow({
  requestId,
  user = "bb-agent:agent-1",
}: {
  requestId: string
  user?: string
}) {
  return {
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
  }
}

function buildLiteLLMPayload({
  requestId = "req-1",
  user = "bb-agent:agent-1",
}: {
  requestId?: string
  user?: string
}) {
  return {
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
  }
}

function mockLiteLLMSummary(
  rows: Array<ReturnType<typeof buildLiteLLMSummaryRow>>,
  {
    times = 1,
    onQuery,
  }: {
    times?: number
    onQuery?: (query: Record<string, string | string[] | undefined>) => void
  } = {}
) {
  return nock(environment.LITELLM_URL)
    .get("/spend/logs/v2")
    .times(times)
    .query(query => {
      onQuery?.(query as Record<string, string | string[] | undefined>)
      return true
    })
    .reply(200, {
      data: rows,
      total: rows.length,
      total_pages: 1,
    })
}

function mockLiteLLMPayload(
  requestId: string,
  payload: ReturnType<typeof buildLiteLLMPayload> | null
) {
  const request = nock(environment.LITELLM_URL).get(
    `/spend/logs/ui/${encodeURIComponent(requestId)}`
  )

  if (!payload) {
    return request.reply(404)
  }

  return request.reply(200, payload)
}

function mockLiteLLMSessionRows(
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
  return nock(environment.LITELLM_URL)
    .get("/spend/logs/session/ui")
    .query(true)
    .reply(200, {
      data: rows,
      total: rows.length,
      total_pages: 1,
    })
}

describe("agentLogs", () => {
  const config = new TestConfiguration()

  const withEnvironment = async <T>(
    environment: "development" | "production",
    task: () => Promise<T>
  ): Promise<T> => {
    const workspaceId =
      environment === "development"
        ? config.getDevWorkspaceId()
        : config.getProdWorkspaceId()
    return await config.doInContext(workspaceId, task)
  }

  const withWorkspace = async <T>(task: () => Promise<T>): Promise<T> => {
    return await withEnvironment("production", task)
  }

  const saveSessionDoc = async (
    doc: AgentLogSessionIndexDoc,
    environment: "development" | "production" = "production"
  ) => {
    return await withEnvironment(environment, async () => {
      const response = await context.getWorkspaceDB().put(doc)
      return {
        ...doc,
        _rev: response.rev,
      }
    })
  }

  const saveAgent = async (agentId: string) => {
    return await withWorkspace(async () => {
      const now = new Date().toISOString()
      const agent = {
        _id: agentId,
        name: "Support Agent",
        aiconfig: "",
        live: true,
        icon: "robot",
        iconColor: "#6a9bcc",
        createdAt: now,
        enabledTools: [],
      }
      const response = await context.getWorkspaceDB().put(agent)
      return {
        ...agent,
        _rev: response.rev,
      }
    })
  }

  const getSessionDoc = async (
    agentId: string,
    sessionId: string,
    environment: "development" | "production" = "production"
  ) => {
    return await withEnvironment(environment, async () => {
      return await context
        .getWorkspaceDB()
        .tryGet<AgentLogSessionIndexDoc>(getSessionDocId(agentId, sessionId))
    })
  }

  beforeAll(async () => {
    await config.init("agent-logs")
  })

  beforeEach(async () => {
    await config.newTenant()
    jest.clearAllMocks()
    nock.cleanAll()
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-03-09T12:00:00.000Z"))
    mocks.licenses.useUnlimited()
  })

  afterEach(() => {
    jest.useRealTimers()
    nock.cleanAll()
  })

  afterAll(() => {
    config.end()
  })

  it("indexes request/session docs idempotently", async () => {
    jest.useRealTimers()
    let summaryQuery: Record<string, string | string[] | undefined> | undefined
    const summaryScope = mockLiteLLMSummary(
      [buildLiteLLMSummaryRow({ requestId: "req-1" })],
      {
        times: 2,
        onQuery: query => {
          summaryQuery = query
        },
      }
    )

    await withWorkspace(async () => {
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
    })

    const sessionDoc = await getSessionDoc("agent-1", "chatconvo_1")

    expect(sessionDoc).toEqual(
      expect.objectContaining({
        sessionId: "chatconvo_1",
        operations: 1,
        trigger: "Chat",
        requestIds: JSON.stringify(["req-1"]),
      })
    )
    expect(summaryScope.isDone()).toBe(true)
    expect(summaryQuery?.start_date).toBe("2026-03-08 00:00:00")
    expect(summaryQuery?.end_date).toBe("2026-03-08 23:59:59")
  })

  it("returns session detail entries in chronological order", async () => {
    jest.useRealTimers()
    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-chronological",
        trigger: "Automation",
        startTime: "2026-03-08T10:00:00.000Z",
        lastActivityAt: "2026-03-08T11:00:10.000Z",
        requestIds: JSON.stringify(["req-old", "req-new"]),
        operations: 2,
      })
    )

    const sessionScope = mockLiteLLMSessionRows([
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

    const detail = await withWorkspace(async () => {
      return await fetchSessionDetail(
        "agent-1",
        "session-chronological",
        "production"
      )
    })

    expect(detail?.entries.map(entry => entry.requestId)).toEqual([
      "req-old",
      "req-new",
    ])
    expect(sessionScope.isDone()).toBe(true)
  })

  it("rejects partially numeric bookmarks when fetching sessions", async () => {
    await expect(
      withWorkspace(async () => {
        return await fetchSessions(
          "agent-1",
          "2026-03-08T00:00:00.000Z",
          "2026-03-08T23:59:59.999Z",
          "123abc"
        )
      })
    ).rejects.toMatchObject({
      status: 400,
      message: "Invalid bookmark query",
    })
  })

  it("calculates the oldest log date from the retention quota", async () => {
    mocks.licenses.setAgentLogsQuota(7)

    await expect(oldestLogDate()).resolves.toBe("2026-03-02T12:00:00.000Z")
  })

  it("treats a missing retention quota as unlimited", async () => {
    const license = cloneDeep(await licensing.cache.getCachedLicense())
    if (license.quotas?.constant) {
      Reflect.deleteProperty(license.quotas.constant, "agentLogRetentionDays")
    }
    mocks.licenses.useLicense(license)

    await expect(oldestLogDate()).resolves.toBe(
      constants.MIN_VALID_DATE.toISOString()
    )
  })

  it("rejects session queries that exceed the maximum scan window", async () => {
    await expect(
      fetchSessions(
        "agent-1",
        "2026-03-08T00:00:00.000Z",
        "2026-03-08T23:59:59.999Z",
        "50",
        100
      )
    ).rejects.toMatchObject({
      status: 400,
      message: "Bookmark query exceeds maximum scan window of 5000 sessions",
    })
  })

  it("rejects invalid environments when fetching session detail", async () => {
    await expect(
      fetchSessionDetail("agent-1", "session-chronological", "staging" as any)
    ).rejects.toMatchObject({
      status: 400,
      message: "Invalid environment query",
    })
  })

  it("treats a zero retention quota as unlimited", async () => {
    mocks.licenses.setAgentLogsQuota(0)

    await expect(oldestLogDate()).resolves.toBe(
      constants.MIN_VALID_DATE.toISOString()
    )
  })

  it("finds expired session docs using lastActivityAt", async () => {
    mocks.licenses.setAgentLogsQuota(7)

    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-old",
        startTime: "2026-03-01T08:00:00.000Z",
        lastActivityAt: "2026-03-01T08:00:00.000Z",
      })
    )
    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-new",
        startTime: "2026-03-08T08:00:00.000Z",
        lastActivityAt: "2026-03-08T08:00:00.000Z",
      })
    )

    const expired = await withWorkspace(async () => {
      return await getExpiredSessions()
    })

    expect(expired.map(session => session.sessionId)).toEqual(["session-old"])
  })

  it("clears expired indexed session docs and leaves newer ones", async () => {
    mocks.licenses.setAgentLogsQuota(7)

    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-old",
        startTime: "2026-03-01T08:00:00.000Z",
        lastActivityAt: "2026-03-01T08:00:00.000Z",
      })
    )
    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-new",
        startTime: "2026-03-08T08:00:00.000Z",
        lastActivityAt: "2026-03-08T08:00:00.000Z",
      })
    )

    await withWorkspace(async () => {
      await clearOldHistory()
    })

    await expect(
      getSessionDoc("agent-1", "session-old")
    ).resolves.toBeUndefined()
    await expect(getSessionDoc("agent-1", "session-new")).resolves.toEqual(
      expect.objectContaining({
        sessionId: "session-new",
      })
    )
  })

  it("returns only sessions inside the retention window", async () => {
    mocks.licenses.setAgentLogsQuota(7)

    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-old",
        firstInput: "Old question",
        startTime: "2026-03-01T08:00:00.000Z",
        lastActivityAt: "2026-03-01T08:00:00.000Z",
      })
    )
    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-new",
        firstInput: "New question",
        startTime: "2026-03-08T08:00:00.000Z",
        lastActivityAt: "2026-03-08T08:00:00.000Z",
        operations: 2,
      })
    )

    const response = await withWorkspace(async () => {
      return await fetchSessions(
        "agent-1",
        "2026-02-20T00:00:00.000Z",
        "2026-03-09T23:59:59.000Z"
      )
    })

    expect(response.sessions).toEqual([
      expect.objectContaining({
        sessionId: "session-new",
        operations: 2,
      }),
    ])
    await expect(
      getSessionDoc("agent-1", "session-old")
    ).resolves.toBeUndefined()
  })

  it("cleans expired sessions in both environments before merging results", async () => {
    mocks.licenses.setAgentLogsQuota(7)

    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-dev-expired",
        firstInput: "Expired development question",
        startTime: "2026-03-02T12:00:00.000Z",
        lastActivityAt: "2026-03-02T12:00:00.000Z",
      }),
      "development"
    )
    await saveSessionDoc(
      createSessionDoc({
        agentId: "agent-1",
        sessionId: "session-prod-new",
        firstInput: "Fresh production question",
        startTime: "2026-03-08T08:00:00.000Z",
        lastActivityAt: "2026-03-08T08:00:00.000Z",
      })
    )

    const response = await withWorkspace(async () => {
      return await fetchSessions(
        "agent-1",
        "2026-02-20T00:00:00.000Z",
        "2026-03-09T23:59:59.000Z"
      )
    })

    expect(response.sessions).toEqual([
      expect.objectContaining({
        sessionId: "session-prod-new",
        environment: "production",
      }),
    ])
    await expect(
      getSessionDoc("agent-1", "session-dev-expired", "development")
    ).resolves.toBeUndefined()
  })

  it("rejects request detail when the returned user belongs to another agent", async () => {
    jest.useRealTimers()
    const summaryScope = mockLiteLLMSummary([])
    const payloadScope = mockLiteLLMPayload(
      "req-1",
      buildLiteLLMPayload({
        requestId: "req-1",
        user: "bb-agent:agent-2",
      })
    )

    await expect(
      withWorkspace(async () => {
        return await fetchRequestDetail("agent-1", "req-1")
      })
    ).rejects.toMatchObject({
      status: 404,
      message: "Agent log detail not found",
    })
    expect(summaryScope.isDone()).toBe(true)
    expect(payloadScope.isDone()).toBe(true)
  })

  it("returns request detail using the real agent lookup path", async () => {
    jest.useRealTimers()
    await saveAgent("agent-1")
    const summaryScope = mockLiteLLMSummary([
      buildLiteLLMSummaryRow({ requestId: "req-1" }),
    ])
    const payloadScope = mockLiteLLMPayload(
      "req-1",
      buildLiteLLMPayload({ requestId: "req-1" })
    )

    const detail = await withWorkspace(async () => {
      return await fetchRequestDetail("agent-1", "req-1")
    })

    expect(detail).toEqual(
      expect.objectContaining({
        requestId: "req-1",
        model: "gpt-5",
        messages: [
          {
            role: "user",
            content: "Question",
          },
        ],
        response: "ok",
        inputTokens: 10,
        outputTokens: 20,
        spend: 0.01,
        inputToolCalls: [],
        toolCalls: [],
        toolResults: [],
      })
    )
    expect(summaryScope.isDone()).toBe(true)
    expect(payloadScope.isDone()).toBe(true)
  })

  it("accepts request detail when LiteLLM summary ownership matches the agent", async () => {
    jest.useRealTimers()
    await saveAgent("agent-1")
    const summaryScope = mockLiteLLMSummary([
      buildLiteLLMSummaryRow({
        requestId: "req-1",
        user: "bb-agent:agent-1",
      }),
    ])
    const payloadScope = mockLiteLLMPayload(
      "req-1",
      buildLiteLLMPayload({
        requestId: "req-1",
        user: "",
      })
    )

    await expect(
      withWorkspace(async () => {
        return await fetchRequestDetail("agent-1", "req-1")
      })
    ).resolves.toEqual(
      expect.objectContaining({
        requestId: "req-1",
        response: "ok",
      })
    )
    expect(summaryScope.isDone()).toBe(true)
    expect(payloadScope.isDone()).toBe(true)
  })

  it("returns not found when LiteLLM does not return request detail", async () => {
    jest.useRealTimers()
    const summaryScope = mockLiteLLMSummary([])
    const payloadScope = mockLiteLLMPayload("req-missing", null)

    await expect(
      withWorkspace(async () => {
        return await fetchRequestDetail("agent-1", "req-missing")
      })
    ).rejects.toMatchObject({
      status: 404,
      message: "Agent log detail not found",
    })
    expect(summaryScope.isDone()).toBe(true)
    expect(payloadScope.isDone()).toBe(true)
  })

  it("returns live session detail when the index doc has been deleted", async () => {
    jest.useRealTimers()
    const sessionScope = mockLiteLLMSessionRows([
      {
        request_id: "req-live",
        session_id: "session-live",
        startTime: "2026-03-08T11:00:00.000Z",
        endTime: "2026-03-08T11:00:10.000Z",
        prompt_tokens: 10,
        completion_tokens: 20,
        spend: 0.01,
        model: "gpt-5",
        end_user: "bb-agent:agent-1",
        status: "success",
      },
    ])

    const detail = await withWorkspace(async () => {
      return await fetchSessionDetail("agent-1", "session-live", "production")
    })

    expect(detail).toEqual(
      expect.objectContaining({
        sessionId: "session-live",
        operations: 1,
        entries: [
          expect.objectContaining({
            requestId: "req-live",
          }),
        ],
      })
    )
    expect(sessionScope.isDone()).toBe(true)
  })
})
