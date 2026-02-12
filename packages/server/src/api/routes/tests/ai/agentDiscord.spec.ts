import crypto from "crypto"
import nock from "nock"
import { DiscordCommands } from "@budibase/shared-core"
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
    const signing = makeDiscordSigningKeyPair()
    const agent = await config.api.agent.create({
      name: "Discord Agent",
      discordIntegration: {
        applicationId: "app-123",
        publicKey: signing.publicKey,
        botToken: "bot-secret",
        guildId: "guild-123",
      },
    })

    const globalScope = nock("https://discord.com")
      .put("/api/v10/applications/app-123/commands", payload => {
        const commands = payload as Array<{ name: string; contexts?: number[] }>
        return (
          Array.isArray(commands) &&
          commands.length === 2 &&
          commands.some(
            command =>
              command.name === DiscordCommands.ASK &&
              command.contexts?.includes(1)
          ) &&
          commands.some(
            command =>
              command.name === DiscordCommands.NEW &&
              command.contexts?.includes(1)
          )
        )
      })
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [
        { id: "cmd-1", name: DiscordCommands.ASK },
        { id: "cmd-2", name: DiscordCommands.NEW },
      ])
    const guildScope = nock("https://discord.com")
      .put(
        "/api/v10/applications/app-123/guilds/guild-123/commands",
        payload => {
          const commands = payload as Array<{ name: string }>
          return (
            Array.isArray(commands) &&
            commands.length === 2 &&
            commands.some(command => command.name === DiscordCommands.ASK) &&
            commands.some(command => command.name === DiscordCommands.NEW)
          )
        }
      )
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [
        { id: "cmd-1", name: DiscordCommands.ASK },
        { id: "cmd-2", name: DiscordCommands.NEW },
      ])

    const result = await config.api.agent.syncDiscordCommands(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.interactionsEndpointUrl).toContain("/api/webhooks/discord/")
    expect(result.interactionsEndpointUrl).toContain(
      `/${config.getProdWorkspaceId()}/`
    )
    expect(result.interactionsEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.interactionsEndpointUrl).toContain(`/${agent._id}`)
    expect(result.inviteUrl).toContain("client_id=app-123")
    expect(globalScope.isDone()).toBe(true)
    expect(guildScope.isDone()).toBe(true)
  })

  it("obfuscates discord secrets in responses and preserves them on update", async () => {
    const signing = makeDiscordSigningKeyPair()
    const created = await config.api.agent.create({
      name: "Discord Obfuscation Agent",
      aiconfig: "test-config",
      discordIntegration: {
        applicationId: "app-123",
        publicKey: signing.publicKey,
        botToken: "bot-secret",
        guildId: "guild-123",
      },
    })

    expect(created.discordIntegration?.publicKey).toEqual("********")
    expect(created.discordIntegration?.botToken).toEqual("********")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(a => a._id === created._id)

    expect(fetched?.discordIntegration?.publicKey).toEqual("********")
    expect(fetched?.discordIntegration?.botToken).toEqual("********")

    const updated = await config.api.agent.update({
      ...(fetched as NonNullable<typeof fetched>),
      live: true,
    })

    expect(updated.discordIntegration?.publicKey).toEqual("********")
    expect(updated.discordIntegration?.botToken).toEqual("********")

    const globalScope = nock("https://discord.com")
      .put("/api/v10/applications/app-123/commands")
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [])

    const guildScope = nock("https://discord.com")
      .put("/api/v10/applications/app-123/guilds/guild-123/commands")
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [])

    await config.api.agent.syncDiscordCommands(created._id!)
    expect(globalScope.isDone()).toBe(true)
    expect(guildScope.isDone()).toBe(true)
  })

  it("returns a validation error when required discord settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Discord Settings",
    })

    await config.api.agent.syncDiscordCommands(agent._id!, undefined, {
      status: 400,
    })
  })

  it("returns a validation error when discord public key is missing", async () => {
    const agent = await config.api.agent.create({
      name: "Missing Discord Public Key",
      discordIntegration: {
        applicationId: "app-123",
        botToken: "bot-secret",
      },
    })

    await config.api.agent.syncDiscordCommands(agent._id!, undefined, {
      status: 400,
    })
  })

  describe("discord webhook signature validation", () => {
    it("rejects webhook calls that target a dev workspace ID", async () => {
      const signing = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Dev Path Rejected Agent",
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
          `/api/webhooks/discord/${config.getDevWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .set("x-signature-ed25519", signature)
        .set("x-signature-timestamp", timestamp)
        .send(body)
        .expect(400)

      expect(response.body.error).toEqual(
        "Discord webhook must target a production workspace ID"
      )
    })

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

    it("responds immediately for unsupported interaction types", async () => {
      const signing = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Unsupported Interaction Agent",
        discordIntegration: {
          publicKey: signing.publicKey,
        },
      })
      await config.publish()

      const body = { type: 3 }
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

      expect(response.body).toEqual({
        type: 4,
        data: {
          content: "Unsupported interaction type.",
        },
      })
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
