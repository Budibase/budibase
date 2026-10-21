import { features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
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
        await config.api.agentRequest.find("req_unknown", { status: 404 })
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
      }
    )
  })
})
