import { features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent eval routes", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withEvalsDisabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_EVALS]: false },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  it("returns 403 when evals feature is disabled", async () => {
    await withEvalsDisabled(async () => {
      await config.api.agent.fetchEvalSuite("agent_test", { status: 403 })
      await config.api.agent.updateEvalSuite(
        "agent_test",
        { cases: [] },
        { status: 403 }
      )
      await config.api.agent.runEvalSuite("agent_test", { status: 403 })
    })
  })
})
