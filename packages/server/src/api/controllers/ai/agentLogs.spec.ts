import type { FetchAgentLogsResponse, UserCtx } from "@budibase/types"
import sdk from "../../../sdk"
import { fetchAgentLogs } from "./agentLogs"

jest.mock("../../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      agentLogs: {
        fetchSessions: jest.fn(),
      },
    },
  },
}))

describe("agentLogs controller", () => {
  const fetchSessionsMock = sdk.ai.agentLogs
    .fetchSessions as jest.MockedFunction<typeof sdk.ai.agentLogs.fetchSessions>

  afterEach(() => {
    jest.clearAllMocks()
  })

  function buildCtx(
    query: Record<string, string>
  ): UserCtx<void, FetchAgentLogsResponse> {
    return {
      params: {
        agentId: "agent-1",
      },
      query,
    } as unknown as UserCtx<void, FetchAgentLogsResponse>
  }

  it("rejects invalid page queries", async () => {
    fetchSessionsMock.mockResolvedValue({
      sessions: [],
      currentPage: 0,
      hasMore: false,
    })

    const ctx = buildCtx({ page: "1abc" })

    await expect(fetchAgentLogs(ctx)).rejects.toMatchObject({
      status: 400,
      message: "Invalid page query",
    })
    expect(fetchSessionsMock).not.toHaveBeenCalled()
  })
})
