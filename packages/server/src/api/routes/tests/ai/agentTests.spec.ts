import { features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent test routes", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withTestsDisabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_TESTS]: false },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  it("returns 403 when tests feature is disabled", async () => {
    await withTestsDisabled(async () => {
      await config.api.agent.fetchTestSuite("agent_test", { status: 403 })
      await config.api.agent.updateTestSuite(
        "agent_test",
        { cases: [] },
        { status: 403 }
      )
      await config.api.agent.runTestSuite("agent_test", { status: 403 })
    })
  })
})
