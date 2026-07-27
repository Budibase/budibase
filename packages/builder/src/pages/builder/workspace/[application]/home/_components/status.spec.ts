import { PublishResourceState, type Agent } from "@budibase/types"
import { getAgentStatusLabel, getPublishResourceStatusLabel } from "./status"

describe("getPublishResourceStatusLabel", () => {
  it("returns Live when resource is published", () => {
    const status = getPublishResourceStatusLabel({
      state: PublishResourceState.PUBLISHED,
      lastDeployedLiveAt: undefined,
    })

    expect(status).toEqual("Live")
  })

  it("returns Not Deployed when resource is disabled and never published", () => {
    const status = getPublishResourceStatusLabel({
      state: PublishResourceState.DISABLED,
      lastDeployedLiveAt: undefined,
    })

    expect(status).toEqual("Not Deployed")
  })

  it("returns Stopped when resource is disabled and was published before", () => {
    const status = getPublishResourceStatusLabel({
      state: PublishResourceState.DISABLED,
      lastDeployedLiveAt: "2026-01-01T00:00:00.000Z",
    })

    expect(status).toEqual("Stopped")
  })
})

describe("getAgentStatusLabel", () => {
  const buildAgent = (overrides?: Partial<Agent>): Agent => ({
    name: "Agent",
    aiconfig: "default",
    ...overrides,
  })

  it("returns Live when the agent is live", () => {
    const status = getAgentStatusLabel(buildAgent({ live: true }))
    expect(status).toEqual("Live")
  })

  it("returns Not Deployed when the agent has no deployment history", () => {
    const status = getAgentStatusLabel(buildAgent({ live: false }))
    expect(status).toEqual("Not Deployed")
  })

  it("returns Stopped when the agent was previously published", () => {
    const status = getAgentStatusLabel(
      buildAgent({
        live: false,
        publishedAt: "2026-01-01T00:00:00.000Z",
      })
    )
    expect(status).toEqual("Stopped")
  })
})
