interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
}

jest.mock("chat", () => {
  const actual = jest.requireActual("../../../../../__mocks__/chat")
  const toMessageText = (value: unknown) =>
    typeof value === "string" ? value : JSON.stringify(value)

  return {
    ...actual,
    Chat: class MockChat {
      private messageHandler:
        | ((thread: any, message: any) => Promise<void>)
        | null = null

      onNewMention(h: any) {
        this.messageHandler = h
      }
      onSubscribedMessage(h: any) {
        this.messageHandler = h
      }
      onNewMessage(_pattern: any, h: any) {
        this.messageHandler = h
      }

      webhooks = {
        teams: async (request: Request) => {
          const auth = request.headers.get("authorization")
          if (!auth) {
            return new Response(
              JSON.stringify({
                "jwt-auth-error": "authorization header not found",
              }),
              {
                status: 401,
                headers: { "content-type": "application/json" },
              }
            )
          }
          if (auth !== "Bearer valid-token") {
            return new Response(
              JSON.stringify({ "jwt-auth-error": "invalid token" }),
              {
                status: 401,
                headers: { "content-type": "application/json" },
              }
            )
          }

          const body = await request.json()
          if (body.type !== "message") {
            return new Response(JSON.stringify({}), {
              status: 200,
              headers: { "content-type": "application/json" },
            })
          }

          const messages: string[] = []
          if (this.messageHandler) {
            const thread = {
              post: async (message: unknown) => {
                messages.push(toMessageText(message))
              },
              postEphemeral: async (
                _user: unknown,
                message: unknown,
                _options: { fallbackToDM: boolean }
              ) => {
                messages.push(toMessageText(message))
                return { usedFallback: false }
              },
              subscribe: async () => {},
            }
            const message = {
              text: body.text || "",
              raw: body,
              author: {
                userId: body.from?.id,
                fullName: body.from?.name,
              },
            }
            await this.messageHandler(thread, message)
          }

          return new Response(JSON.stringify({ messages }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        },
      }
    },
  }
})

jest.mock("@chat-adapter/teams", () => ({
  createTeamsAdapter: jest.fn(() => ({})),
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
import { context, docIds } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  DocumentType,
  type Agent,
  type ChatConversation,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>

const extractLinkUrl = (messages: string[]) => {
  const urls = messages
    .flatMap(message => message.match(/https?:\/\/[^\s"\\]+/g) || [])
    .filter(url => url.includes("/api/chat-links/"))
  return urls[0]
}

describe("agent teams integration provisioning", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
    mockedWebhookChat.mockClear()
  })

  afterAll(() => {
    config.end()
  })

  it("provisions teams channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Agent",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: "azure-tenant-id",
      },
    })

    const result = await config.api.agent.provisionMSTeamsChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/ms-teams/")
    expect(result.messagingEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.MSTeamsIntegration?.chatAppId).toEqual(result.chatAppId)
    expect(updated?.MSTeamsIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )
  })

  it("obfuscates teams secrets in responses and preserves them on update", async () => {
    const created = await config.api.agent.create({
      name: "Teams Obfuscation Agent",
      aiconfig: "test-config",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: "azure-tenant-id",
      },
    })

    expect(created.MSTeamsIntegration?.appPassword).toEqual("********")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(a => a._id === created._id)
    expect(fetched?.MSTeamsIntegration?.appPassword).toEqual("********")

    const updated = await config.api.agent.update({
      ...(fetched as NonNullable<typeof fetched>),
      live: true,
    })
    expect(updated.MSTeamsIntegration?.appPassword).toEqual("********")

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Agent>(created._id!)
      expect(stored.MSTeamsIntegration?.appPassword).toEqual(
        "teams-app-password"
      )
    })
  })

  it("returns a validation error when teams settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Teams Settings",
    })

    await config.api.agent.provisionMSTeamsChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  describe("teams webhook auth validation", () => {
    it("rejects requests without an authorization header", async () => {
      const agent = await config.api.agent.create({
        name: "Teams Webhook Agent",
        MSTeamsIntegration: {
          appId: "teams-app-id",
          appPassword: "teams-app-password",
          tenantId: "azure-tenant-id",
        },
      })
      await config.publish()

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .send({})
        .expect(401)

      expect(response.body["jwt-auth-error"]).toEqual(
        "authorization header not found"
      )
    })
  })

  describe("teams webhook incoming messages", () => {
    const postTeamsMessage = async ({
      path,
      body,
    }: {
      path: string
      body: Record<string, unknown>
    }) =>
      await config
        .getRequest()!
        .post(path)
        .set("Authorization", "Bearer valid-token")
        .send(body)
        .expect(200)

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

    const setupProvisionedTeamsAgent = async () => {
      const agent = await config.api.agent.create({
        name: "Teams Incoming Messages Agent",
        MSTeamsIntegration: {
          appId: "teams-app-id",
          appPassword: "teams-app-password",
          tenantId: "azure-tenant-id",
        },
      })
      const channel = await config.api.agent.provisionMSTeamsChannel(agent._id!)
      await config.publish()
      const linkExternalUser = async (
        externalUserId: string,
        providerTenantId = "tenant-1"
      ) => {
        await config.doInContext(config.getProdWorkspaceId(), async () => {
          await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
            provider: "msteams",
            externalUserId,
            providerTenantId,
            globalUserId: config.getUser()._id!,
            linkedBy: config.getUser()._id!,
          })
        })
      }
      return { agent, chatAppId: channel.chatAppId, linkExternalUser }
    }

    it(`returns a private link prompt for ${ChatCommands.LINK} and /${ChatCommands.LINK} commands`, async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-link-1",
          type: "message",
          text: ChatCommands.LINK,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
      expect(mockedWebhookChat).not.toHaveBeenCalled()
    })

    it("blocks unlinked users and guides them to link first", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-unlinked",
          type: "message",
          text: `${ChatCommands.ASK} hello teams`,
          from: { id: "user-unlinked", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages.join(" ")).toContain(ChatCommands.LINK)
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it(`creates a conversation from an incoming ${ChatCommands.ASK} message`, async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: `${ChatCommands.ASK} hello teams`,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      const firstPart =
        mockedWebhookChat.mock.calls[0]?.[0].chat.messages[0]?.parts[0]
      expect(firstPart?.type === "text" ? firstPart.text : undefined).toEqual(
        "hello teams"
      )

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.channel?.provider).toEqual("msteams")
      expect(conversations[0]?.userId).toEqual(config.getUser()._id)
      expect(conversations[0]?.messages).toHaveLength(2)
    })

    it("reuses the existing conversation for subsequent messages in the same scope", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: `${ChatCommands.ASK} first`,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-2",
          type: "message",
          text: `${ChatCommands.ASK} second`,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)
      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.messages).toHaveLength(4)
      const userTexts = conversations[0]!.messages
        .filter(message => message.role === "user")
        .map(
          message =>
            message.parts?.[0]?.type === "text" && message.parts[0].text
        )
      expect(userTexts).toEqual(["first", "second"])
    })

    it("starts a new empty conversation for /new without calling chat completion", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-new-1",
          type: "message",
          text: ChatCommands.NEW,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain(
        "Started a new conversation. Send a message to continue."
      )
      expect(mockedWebhookChat).not.toHaveBeenCalled()

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.messages).toHaveLength(0)
    })
  })
})
