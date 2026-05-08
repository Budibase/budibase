interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
}

jest.mock("@chat-adapter/discord", () => ({
  createDiscordAdapter: jest.fn((options: Record<string, unknown>) => options),
}))

jest.mock("@chat-adapter/state-memory", () => ({
  createMemoryState: jest.fn(() => ({})),
}))

jest.mock("../../../controllers/ai/chatConversations", () => {
  const actual = jest.requireActual("../../../controllers/ai/chatConversations")
  return {
    ...actual,
    webhookChat: jest.fn(async ({ chat }: MockWebhookChatPayload) => ({
      messages: [
        ...chat.messages,
        {
          id: `assistant-${chat.messages.length + 1}`,
          role: "assistant",
          parts: [{ type: "text", text: "Mock assistant response" }],
        },
      ],
      assistantText: "Mock assistant response",
      title: chat.title || "Mock conversation",
    })),
  }
})

import crypto from "crypto"
import nock from "nock"
import { context, db, docIds, encryption, roles } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  DocumentType,
  type Agent,
  type ChatConversation,
} from "@budibase/types"
import sdk from "../../../../sdk"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const DISCORD_PUBLIC_KEY_DER_PREFIX = "302a300506032b6570032100"
const SECRET_ENCODING_PREFIX = "bbai_enc::"
const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>

const extractLinkUrl = (messages: string[]) => {
  const urls = messages
    .flatMap(message => message.match(/https?:\/\/[^\s"\\]+/g) || [])
    .filter(url => url.includes("/api/chat-links/"))
  return urls[0]
}

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

const secretMatch = (plain: string, encoded: string) => {
  if (!encoded.startsWith(SECRET_ENCODING_PREFIX)) {
    throw new Error("Encoded discord secret not properly configured.")
  }
  return encryption.compare(
    plain,
    encoded.substring(SECRET_ENCODING_PREFIX.length)
  )
}

describe("agent discord integration sync", () => {
  const config = new TestConfiguration()

  async function getPersistedAgent(id: string | undefined) {
    const result = await db.doWithDB(config.getDevWorkspaceId(), db =>
      db.tryGet<Agent>(id)
    )
    if (!result) {
      throw new Error(`Agent ${id} not found`)
    }
    return result
  }

  const getPersistedChatApp = async () =>
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      return await sdk.ai.chatApps.getSingle()
    })

  beforeEach(async () => {
    await config.newTenant()
    mockedWebhookChat.mockClear()
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
          commands.length === 3 &&
          commands.some(
            command =>
              command.name === ChatCommands.ASK &&
              command.contexts?.includes(1) &&
              !command.contexts?.includes(0)
          ) &&
          commands.some(
            command =>
              command.name === ChatCommands.NEW &&
              command.contexts?.includes(1) &&
              !command.contexts?.includes(0)
          ) &&
          commands.some(
            command =>
              command.name === ChatCommands.LINK &&
              command.contexts?.includes(1) &&
              !command.contexts?.includes(0)
          )
        )
      })
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [
        { id: "cmd-1", name: ChatCommands.ASK },
        { id: "cmd-2", name: ChatCommands.NEW },
        { id: "cmd-3", name: ChatCommands.LINK },
      ])
    const guildScope = nock("https://discord.com")
      .put(
        "/api/v10/applications/app-123/guilds/guild-123/commands",
        payload => {
          const commands = payload as Array<{ name: string }>
          return (
            Array.isArray(commands) &&
            commands.length === 3 &&
            commands.some(command => command.name === ChatCommands.ASK) &&
            commands.some(command => command.name === ChatCommands.NEW) &&
            commands.some(command => command.name === ChatCommands.LINK)
          )
        }
      )
      .matchHeader("authorization", "Bot bot-secret")
      .reply(200, [
        { id: "cmd-1", name: ChatCommands.ASK },
        { id: "cmd-2", name: ChatCommands.NEW },
        { id: "cmd-3", name: ChatCommands.LINK },
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

    const chatApp = await getPersistedChatApp()
    expect(chatApp?.agents).toContainEqual({
      agentId: agent._id,
      isEnabled: false,
      isDefault: false,
    })
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

    const persisted = await getPersistedAgent(created._id)
    expect(
      secretMatch(signing.publicKey, persisted.discordIntegration!.publicKey!)
    ).toBeTrue()
    expect(
      secretMatch("bot-secret", persisted.discordIntegration!.botToken!)
    ).toBeTrue()

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

  describe("discord webhook signature validation", () => {
    it("rejects webhook calls that target a dev workspace ID", async () => {
      const signing = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Dev Path Rejected Agent",
        discordIntegration: {
          applicationId: "app-dev-path",
          publicKey: signing.publicKey,
          botToken: "bot-token-dev-path",
          guildId: "guild-dev-path",
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
          applicationId: "app-webhook-agent",
          publicKey: signing.publicKey,
          botToken: "bot-token-webhook-agent",
          guildId: "guild-webhook-agent",
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

    it("rejects signatures that do not match the configured agent key", async () => {
      const configuredSigning = makeDiscordSigningKeyPair()
      const wrongSigning = makeDiscordSigningKeyPair()
      const agent = await config.api.agent.create({
        name: "Discord Wrong Signature Agent",
        discordIntegration: {
          applicationId: "app-wrong-signature",
          publicKey: configuredSigning.publicKey,
          botToken: "bot-token-wrong-signature",
          guildId: "guild-wrong-signature",
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

  describe("discord webhook incoming commands", () => {
    const fetchConversations = async () =>
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const response = await db.allDocs<ChatConversation>(
          docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
            include_docs: true,
          })
        )
        return response.rows
          .map(row => row.doc)
          .filter((chat): chat is ChatConversation => !!chat)
      })

    const mockDiscordCommandSync = ({
      applicationId,
      botToken,
      guildId,
    }: {
      applicationId: string
      botToken: string
      guildId: string
    }) => {
      const globalScope = nock("https://discord.com")
        .put(`/api/v10/applications/${applicationId}/commands`)
        .matchHeader("authorization", `Bot ${botToken}`)
        .reply(200, [])
      const guildScope = nock("https://discord.com")
        .put(
          `/api/v10/applications/${applicationId}/guilds/${guildId}/commands`
        )
        .matchHeader("authorization", `Bot ${botToken}`)
        .reply(200, [])

      return { globalScope, guildScope }
    }

    const setupProvisionedDiscordAgent = async ({
      requireUserLink,
      roleId,
    }: {
      requireUserLink?: boolean
      roleId?: string
    } = {}) => {
      const signing = makeDiscordSigningKeyPair()
      const applicationId = "app-discord-optional-link"
      const botToken = "bot-token-discord-optional-link"
      const guildId = "guild-123"
      const agent = await config.api.agent.create({
        name: "Discord Incoming Commands Agent",
        aiconfig: "test-config",
        discordIntegration: {
          applicationId,
          publicKey: signing.publicKey,
          botToken,
          guildId,
          ...(requireUserLink !== undefined && { requireUserLink }),
        },
      })

      mockDiscordCommandSync({ applicationId, botToken, guildId })
      const channel = await config.api.agent.syncDiscordCommands(agent._id!)

      if (roleId) {
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const chatApp = await sdk.ai.chatApps.getSingle()
          if (!chatApp) {
            throw new Error("Chat app not found")
          }
          await sdk.ai.chatApps.update({
            ...chatApp,
            agents: chatApp.agents.map(chatAgent =>
              chatAgent.agentId === agent._id
                ? { ...chatAgent, roleId }
                : chatAgent
            ),
          })
        })
      }

      await config.publish()

      const linkExternalUser = async (externalUserId: string) => {
        await config.doInTenant(async () => {
          await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
            provider: AgentChannelProvider.DISCORD,
            externalUserId,
            guildId,
            globalUserId: config.getUser()._id!,
            linkedBy: config.getUser()._id!,
          })
        })
      }

      return {
        agent,
        chatAppId: channel.chatAppId,
        guildId,
        linkExternalUser,
        signing,
      }
    }

    const postDiscordCommand = async ({
      path,
      signing,
      command = ChatCommands.ASK,
      text = "hello discord",
      userId = "user-unlinked",
      guildId = "guild-123",
    }: {
      path: string
      signing: ReturnType<typeof makeDiscordSigningKeyPair>
      command?: string
      text?: string
      userId?: string
      guildId?: string
    }) => {
      const body = {
        id: "interaction-1",
        type: 2,
        token: "interaction-token",
        application_id: "app-discord-optional-link",
        channel_id: "channel-1",
        guild_id: guildId,
        data: {
          name: command,
          options: text ? [{ name: "message", value: text }] : [],
        },
        member: {
          user: {
            id: userId,
            username: "Discord User",
          },
        },
      }
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const signature = signDiscordPayload({
        body,
        privateKey: signing.privateKey,
        timestamp,
      })

      return await config
        .getRequest()!
        .post(path)
        .set("x-signature-ed25519", signature)
        .set("x-signature-timestamp", timestamp)
        .send(body)
        .expect(200)
    }

    it("blocks unlinked users by default and guides them to link first", async () => {
      const { agent, chatAppId, signing } = await setupProvisionedDiscordAgent()
      const path = `/api/webhooks/discord/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postDiscordCommand({ path, signing })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages.join(" ")).toContain(
        `/${ChatCommands.LINK}`
      )
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it("blocks unlinked users when requireUserLink is true", async () => {
      const { agent, chatAppId, signing } = await setupProvisionedDiscordAgent({
        requireUserLink: true,
      })
      const path = `/api/webhooks/discord/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postDiscordCommand({ path, signing })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages.join(" ")).toContain(
        `/${ChatCommands.LINK}`
      )
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it("allows optional-link unlinked users and reuses their synthetic conversation", async () => {
      const { agent, chatAppId, signing } = await setupProvisionedDiscordAgent({
        requireUserLink: false,
      })
      const path = `/api/webhooks/discord/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postDiscordCommand({ path, signing, text: "first" })
      const response = await postDiscordCommand({
        path,
        signing,
        text: "second",
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.userId).toEqual(
        "discord:guild-123:user-unlinked"
      )
      expect(conversations[0]?.messages).toHaveLength(4)

      await config.doInTenant(async () => {
        const link = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.DISCORD,
          externalUserId: "user-unlinked",
        })
        expect(link).toBeUndefined()
      })
    })

    it("blocks optional-link unlinked users when the agent requires a higher role", async () => {
      const { agent, chatAppId, signing } = await setupProvisionedDiscordAgent({
        requireUserLink: false,
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      })
      const path = `/api/webhooks/discord/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postDiscordCommand({ path, signing })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages).toContain(
        "This agent is not available to unlinked users."
      )
    })

    it("uses the linked Budibase user when linking is optional", async () => {
      const { agent, chatAppId, linkExternalUser, signing } =
        await setupProvisionedDiscordAgent({
          requireUserLink: false,
        })
      const path = `/api/webhooks/discord/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postDiscordCommand({
        path,
        signing,
        text: "hello linked discord",
        userId: "user-1",
      })

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.userId).toEqual(config.getUser()._id)
    })

    it(`keeps /${ChatCommands.LINK} available when linking is optional`, async () => {
      const { agent, chatAppId, signing } = await setupProvisionedDiscordAgent({
        requireUserLink: false,
      })
      const path = `/api/webhooks/discord/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postDiscordCommand({
        path,
        signing,
        command: ChatCommands.LINK,
        text: "",
      })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })
  })
})
