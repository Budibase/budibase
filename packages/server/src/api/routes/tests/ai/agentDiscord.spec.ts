import crypto from "crypto"
import nock from "nock"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

const DISCORD_PUBLIC_KEY_DER_PREFIX = "302a300506032b6570032100"

const makeDiscordSigningKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519")
  const publicDer = publicKey.export({ type: "spki", format: "der" })
  const publicHex = Buffer.from(publicDer).toString("hex")
  if (!publicHex.startsWith(DISCORD_PUBLIC_KEY_DER_PREFIX)) {
    throw new Error("Unexpected ed25519 public key format")
  }
  return {
    publicKey: publicHex.slice(DISCORD_PUBLIC_KEY_DER_PREFIX.length),
    privateKey,
  }
}

const signDiscordPayload = ({
  body,
  privateKey,
  timestamp,
}: {
  body: Record<string, unknown>
  privateKey: crypto.KeyObject
  timestamp: string
}) =>
  crypto
    .sign(
      null,
      new Uint8Array(Buffer.from(`${timestamp}${JSON.stringify(body)}`)),
      privateKey
    )
    .toString("hex")

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

    await config.api.agent.syncDiscordCommands(agent._id!, undefined, {
      status: 400,
    })
  })

  it("allows Discord command names that follow Discord unicode naming rules", async () => {
    const agent = await config.api.agent.create({
      name: "Discord Unicode Agent",
      discordIntegration: {
        applicationId: "app-unicode",
        botToken: "bot-secret",
        guildId: "guild-unicode",
        askCommandName: "café",
        newCommandName: "नया",
      },
    })

    const scope = nock("https://discord.com")
      .put(
        "/api/v10/applications/app-unicode/guilds/guild-unicode/commands",
        payload => {
          const commands = payload as Array<{ name: string }>
          return (
            Array.isArray(commands) &&
            commands.length === 2 &&
            commands.some(command => command.name === "café") &&
            commands.some(command => command.name === "नया")
          )
        }
      )
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [
        { id: "cmd-1", name: "café" },
        { id: "cmd-2", name: "नया" },
      ])

    const result = await config.api.agent.syncDiscordCommands(agent._id!)
    expect(result.askCommandName).toBe("café")
    expect(result.newCommandName).toBe("नया")
    expect(scope.isDone()).toBe(true)
  })

  describe("discord webhook signature validation", () => {
    it("validates signatures with the configured agent public key", async () => {
      const signing = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Webhook Agent",
        discordIntegration: {
          publicKey: signing.publicKey,
        },
      })
      await config.publish()

      const body = { type: 1 }
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const signature = signDiscordPayload({
        body,
        privateKey: signing.privateKey,
        timestamp,
      })

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/discord/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .set("x-signature-ed25519", signature)
        .set("x-signature-timestamp", timestamp)
        .send(body)
        .expect(200)

      expect(response.body).toEqual({ type: 1 })
    })

    it("rejects stale timestamps", async () => {
      const signing = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Stale Timestamp Agent",
        discordIntegration: {
          publicKey: signing.publicKey,
        },
      })
      await config.publish()

      const body = { type: 1 }
      const timestamp = Math.floor(Date.now() / 1000 - 3600).toString()
      const signature = signDiscordPayload({
        body,
        privateKey: signing.privateKey,
        timestamp,
      })

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/discord/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .set("x-signature-ed25519", signature)
        .set("x-signature-timestamp", timestamp)
        .send(body)
        .expect(401)

      expect(response.body.error).toEqual("Invalid Discord signature timestamp")
    })

    it("rejects signatures that do not match the configured agent key", async () => {
      const configuredSigning = makeDiscordSigningKeyPair()
      const wrongSigning = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Wrong Signature Agent",
        discordIntegration: {
          publicKey: configuredSigning.publicKey,
        },
      })
      await config.publish()

      const body = { type: 1 }
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const signature = signDiscordPayload({
        body,
        privateKey: wrongSigning.privateKey,
        timestamp,
      })

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/discord/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .set("x-signature-ed25519", signature)
        .set("x-signature-timestamp", timestamp)
        .send(body)
        .expect(401)

      expect(response.body.error).toEqual("Invalid Discord signature")
    })
  })
})
