import nock from "nock"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent discord integration sync", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
    nock.cleanAll()
  })

  afterAll(() => {
    nock.cleanAll()
    config.end()
  })

  it("syncs ask/new slash commands for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Discord Agent",
      discordIntegration: {
        applicationId: "app-123",
        botToken: "bot-secret",
        guildId: "guild-123",
        askCommandName: "support",
        newCommandName: "restart",
      },
    })

    const scope = nock("https://discord.com")
      .put(
        "/api/v10/applications/app-123/guilds/guild-123/commands",
        payload => {
          const commands = payload as Array<{ name: string }>
          return (
            Array.isArray(commands) &&
            commands.length === 2 &&
            commands.some(command => command.name === "support") &&
            commands.some(command => command.name === "restart")
          )
        }
      )
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [
        { id: "cmd-1", name: "support" },
        { id: "cmd-2", name: "restart" },
      ])

    const result = await config.api.agent.syncDiscordCommands(agent._id!)

    expect(result.success).toBe(true)
    expect(result.askCommandName).toBe("support")
    expect(result.newCommandName).toBe("restart")
    expect(result.chatAppId).toBeTruthy()
    expect(result.interactionsEndpointUrl).toContain("/api/webhooks/discord/")
    expect(result.interactionsEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.interactionsEndpointUrl).toContain(`/${agent._id}`)
    expect(result.inviteUrl).toContain("client_id=app-123")
    expect(scope.isDone()).toBe(true)
  })

  it("returns a validation error when required discord settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Discord Settings",
    })

    await config.api.agent.syncDiscordCommands(
      agent._id!,
      undefined,
      {
        status: 400,
      }
    )
  })
})
