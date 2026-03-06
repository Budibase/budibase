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
  const fetchSessionsMock = sdk.ai.agentLogs.fetchSessions as jest.MockedFunction<
    typeof sdk.ai.agentLogs.fetchSessions
  >

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

  it("sanitizes invalid page queries before calling the sdk", async () => {
    fetchSessionsMock.mockResolvedValue({
      sessions: [],
      currentPage: 0,
      hasMore: false,
    })

    const ctx = buildCtx({ page: "1abc" })

    await fetchAgentLogs(ctx)

    expect(fetchSessionsMock).toHaveBeenCalledWith(
      "agent-1",
      expect.any(String),
      expect.any(String),
      0
    )
  })
})
