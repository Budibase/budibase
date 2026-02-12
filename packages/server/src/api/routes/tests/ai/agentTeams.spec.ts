import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent teams integration sync", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("syncs teams channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Agent",
      teamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
      },
    })

    const result = await config.api.agent.syncTeamsChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/teams/")
    expect(result.messagingEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.teamsIntegration?.chatAppId).toEqual(result.chatAppId)
    expect(updated?.teamsIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )
  })

  it("returns a validation error when teams settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Teams Settings",
    })

    await config.api.agent.syncTeamsChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  it("returns a validation error when teams app password is missing", async () => {
    const agent = await config.api.agent.create({
      name: "Missing Teams Password",
      teamsIntegration: {
        appId: "teams-app-id",
      },
    })

    await config.api.agent.syncTeamsChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  describe("teams webhook auth validation", () => {
    it("rejects requests without an authorization header", async () => {
      const agent = await config.api.agent.create({
        name: "Teams Webhook Agent",
        teamsIntegration: {
          appId: "teams-app-id",
          appPassword: "teams-app-password",
        },
      })
      await config.publish()

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/teams/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .send({})
        .expect(401)

      expect(response.body["jwt-auth-error"]).toEqual(
        "authorization header not found"
      )
    })

    it("rejects invalid bearer tokens", async () => {
      const agent = await config.api.agent.create({
        name: "Teams Invalid Token Agent",
        teamsIntegration: {
          appId: "teams-app-id",
          appPassword: "teams-app-password",
        },
      })
      await config.publish()

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/teams/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .set("Authorization", "Bearer not-a-real-token")
        .send({})
        .expect(401)

      expect(response.body["jwt-auth-error"]).toBeTruthy()
    })
  })
})
