import { context, features } from "@budibase/backend-core"
import { AGENT_REQUEST_TYPE, FeatureFlag } from "@budibase/types"
import type { AgentRequest } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/api/requests", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("returns 404 when the feature flag is disabled", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_AGENT_ACTIVITY]: false },
      async () => {
        await config.api.agentRequest.fetch({ status: 404 })
        await config.api.agentRequest.fetchForWorkspace({ status: 404 })
      }
    )
  })

  it("serves the inbox when the feature flag is enabled", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
      async () => {
        const response = await config.api.agentRequest.fetch()
        expect(response.requests).toEqual([])
        const workspaceResponse =
          await config.api.agentRequest.fetchForWorkspace()
        expect(workspaceResponse.requests).toEqual([])
      }
    )
  })

  it("serves request detail only when the feature flag is enabled", async () => {
    const requestId = "req_flag_gate"
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const request: AgentRequest = {
        _id: requestId,
        type: AGENT_REQUEST_TYPE,
        workspaceId: config.getProdWorkspaceId(),
        agentId: "agent_flag_gate",
        userId: config.getUser()._id,
        title: "Buy a laptop",
        entries: [],
        status: "completed",
        statusRank: 2,
        approvers: [],
        pendingApprovers: [],
        respondedApprovers: [],
      }
      await context.getRequestsDB().put(request)
    })

    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
      async () => {
        const response = await config.api.agentRequest.find(requestId)
        expect(response.requestId).toEqual(requestId)
      }
    )

    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_AGENT_ACTIVITY]: false },
      async () => {
        await config.api.agentRequest.find(requestId, { status: 404 })
      }
    )
  })
})
