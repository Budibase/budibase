import type { Agent } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { findIntegrationAgent } from "./utils"

describe("findIntegrationAgent", () => {
  const config = new TestConfiguration()

  const hasSlack = (agent: Agent) => !!agent.slackIntegration?.botToken

  let withIntegration: Agent
  let withoutIntegration: Agent

  beforeEach(async () => {
    await config.newTenant()
    withIntegration = await config.api.agent.create({
      name: "Slack Agent",
      slackIntegration: { botToken: "slack-token" },
    })
    withoutIntegration = await config.api.agent.create({
      name: "Bare Agent",
    })
  })

  afterAll(() => {
    config.end()
  })

  it("returns the named agent when it has the integration", async () => {
    const agent = await findIntegrationAgent(
      config.getDevWorkspaceId(),
      withIntegration._id,
      hasSlack
    )
    expect(agent?._id).toEqual(withIntegration._id)
  })

  it("does not fall back to another agent when the named agent lacks the integration", async () => {
    const agent = await findIntegrationAgent(
      config.getDevWorkspaceId(),
      withoutIntegration._id,
      hasSlack
    )
    expect(agent).toBeUndefined()
  })

  it("returns undefined when no agentId is given", async () => {
    const agent = await findIntegrationAgent(
      config.getDevWorkspaceId(),
      undefined,
      hasSlack
    )
    expect(agent).toBeUndefined()
  })
})
