interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
}

interface ChatMockModule {
  resetMockChatState: () => void
  setMockPostEphemeralResult: (
    provider: "slack" | "teams" | "telegram",
    result: { usedFallback: boolean }
  ) => void
}

jest.mock("@chat-adapter/telegram", () => ({
  createTelegramAdapter: jest.fn(() => ({})),
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

import sdk from "../../../../sdk"
import { context, db, docIds, encryption } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  DocumentType,
  type Agent,
  type ChatConversation,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const SECRET_ENCODING_PREFIX = "bbai_enc::"
const { resetMockChatState } = jest.requireActual("chat") as ChatMockModule

const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>

const extractLinkUrl = (messages: string[]) => {
  const urls = messages
    .flatMap(message => message.match(/https?:\/\/[^\s"\\]+/g) || [])
    .filter(url => url.includes("/api/chat-links/"))
  return urls[0]
}

const secretMatch = (plain: string, encoded: string) => {
  if (!encoded.startsWith(SECRET_ENCODING_PREFIX)) {
    throw new Error("Encoded telegram secret not properly configured.")
  }
  return encryption.compare(
    plain,
    encoded.substring(SECRET_ENCODING_PREFIX.length)
  )
}

describe("agent telegram integration provisioning", () => {
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

  const mockFetch = () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
        text: () => Promise.resolve('{"ok":true}'),
      })
    ) as jest.Mock
  }

  beforeEach(async () => {
    await config.newTenant()
    mockedWebhookChat.mockClear()
    resetMockChatState()
    mockFetch()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    config.end()
  })

  it("provisions telegram channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Telegram Agent",
      telegramIntegration: {
        botToken: "123456:telegram-token-1",
      },
    })

    const result = await config.api.agent.provisionTelegramChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/telegram/")
    expect(result.messagingEndpointUrl).toContain(
      `/${config.getProdWorkspaceId()}/`
    )
    expect(result.messagingEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.telegramIntegration?.chatAppId).toEqual(result.chatAppId)
    expect(updated?.telegramIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )
  })

  it("obfuscates telegram secrets in responses and preserves them on update", async () => {
    const created = await config.api.agent.create({
      name: "Telegram Obfuscation Agent",
      aiconfig: "test-config",
      telegramIntegration: {
        botToken: "123:token-plain",
        webhookSecretToken: "wh-secret-plain",
      },
    })

    expect(created.telegramIntegration?.botToken).toEqual("********")
    expect(created.telegramIntegration?.webhookSecretToken).toEqual("********")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(a => a._id === created._id)
    expect(fetched?.telegramIntegration?.botToken).toEqual("********")
    expect(fetched?.telegramIntegration?.webhookSecretToken).toEqual("********")

    const updated = await config.api.agent.update({
      ...(fetched as NonNullable<typeof fetched>),
      live: true,
    })
    expect(updated.telegramIntegration?.botToken).toEqual("********")
    expect(updated.telegramIntegration?.webhookSecretToken).toEqual("********")

    const persisted = await getPersistedAgent(created._id)
    expect(
      secretMatch("123:token-plain", persisted.telegramIntegration!.botToken!)
    ).toBeTrue()
    expect(
      secretMatch(
        "wh-secret-plain",
        persisted.telegramIntegration!.webhookSecretToken!
      )
    ).toBeTrue()
  })

  it("returns a validation error when telegram settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Telegram Settings",
    })

    await config.api.agent.provisionTelegramChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  it("returns warning when telegram setWebhook fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            ok: false,
            error_code: 400,
            description: "Bad Request: bad webhook",
          }),
        text: () => Promise.resolve('{"ok":false,"error_code":400}'),
      })
    ) as jest.Mock

    const agent = await config.api.agent.create({
      name: "Telegram Webhook Fail Agent",
      telegramIntegration: {
        botToken: "123:token-webhook-fail",
      },
    })

    const result = await config.api.agent.provisionTelegramChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/telegram/")
    expect(result.warning).toContain("Bad Request: bad webhook")
  })

  it("returns an error when telegram setWebhook fails while enabling deployment", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            ok: false,
            error_code: 400,
            description: "Bad Request: bad webhook",
          }),
        text: () => Promise.resolve('{"ok":false,"error_code":400}'),
      })
    ) as jest.Mock

    const agent = await config.api.agent.create({
      name: "Telegram Toggle Webhook Fail Agent",
      telegramIntegration: {
        botToken: "123:token-toggle-webhook-fail",
      },
    })

    await config.api.agent.toggleTelegramDeployment(
      agent._id!,
      { enabled: true },
      {
        status: 400,
      }
    )
  })

  describe("telegram webhook incoming messages", () => {
    const postTelegramUpdate = async ({
      path,
      body,
      secret,
    }: {
      path: string
      body: Record<string, unknown>
      secret?: string
    }) => {
      const req = config.getRequest()!.post(path)
      if (secret) {
        req.set("x-telegram-bot-api-secret-token", secret)
      }
      return await req.send(body).expect(200)
    }

    const setupProvisionedTelegramAgent = async () => {
      const agent = await config.api.agent.create({
        name: "Telegram Incoming Messages Agent",
        telegramIntegration: {
          botToken: "123:token-webhook",
          webhookSecretToken: "tg-hook-secret",
        },
      })
      const channel = await config.api.agent.provisionTelegramChannel(
        agent._id!
      )
      await config.publish()
      const linkExternalUser = async (externalUserId: string) => {
        await config.doInTenant(async () => {
          await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
            provider: AgentChannelProvider.TELEGRAM,
            externalUserId,
            globalUserId: config.getUser()._id!,
            linkedBy: config.getUser()._id!,
          })
        })
      }
      return { agent, chatAppId: channel.chatAppId, linkExternalUser }
    }

    it(`returns a private link prompt for /${ChatCommands.LINK}`, async () => {
      const { agent, chatAppId } = await setupProvisionedTelegramAgent()
      const path = `/api/webhooks/telegram/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTelegramUpdate({
        path,
        secret: "tg-hook-secret",
        body: {
          message: {
            message_id: 1,
            date: 1700000000,
            chat: { id: 999001, type: "private" },
            from: {
              id: 4242,
              is_bot: false,
              first_name: "Tele",
              username: "teleuser",
            },
            text: `/${ChatCommands.LINK}`,
          },
        },
      })

      const linkUrl = extractLinkUrl(response.body.messages)
      expect(linkUrl).toBeTruthy()
      expect(linkUrl).toContain("/handoff")
    })

    it("runs agent reply for a linked telegram user", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTelegramAgent()
      await linkExternalUser("4242")
      const path = `/api/webhooks/telegram/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postTelegramUpdate({
        path,
        secret: "tg-hook-secret",
        body: {
          message: {
            message_id: 2,
            date: 1700000001,
            chat: { id: 999001, type: "private" },
            from: {
              id: 4242,
              is_bot: false,
              first_name: "Tele",
              username: "teleuser",
            },
            text: "Hello from Telegram",
          },
        },
      })

      const chats = await config.doInContext(
        config.getProdWorkspaceId(),
        async () => {
          const db = context.getWorkspaceDB()
          const response = await db.allDocs<ChatConversation>(
            docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
              include_docs: true,
            })
          )
          return response.rows
            .map(row => row.doc)
            .filter((chat): chat is ChatConversation => !!chat)
        }
      )

      expect(chats.length).toBeGreaterThan(0)
      const last = chats[chats.length - 1]
      expect(last.channel?.provider).toEqual(AgentChannelProvider.TELEGRAM)
      expect(mockedWebhookChat).toHaveBeenCalled()
    })
  })
})
