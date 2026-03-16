interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
}

jest.mock("chat", () => {
  return {
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
        slack: async (request: Request) => {
          const body = await request.json()
          const event = body?.event
          if (body?.type !== "event_callback" || event?.type !== "message") {
            return new Response(JSON.stringify({ messages: [] }), {
              status: 200,
              headers: { "content-type": "application/json" },
            })
          }

          const messages: string[] = []
          if (this.messageHandler) {
            const channel = event.channel || ""
            const threadTs =
              event.channel_type === "im"
                ? event.thread_ts || ""
                : event.thread_ts || event.ts || ""
            const thread = {
              id: `slack:${channel}:${threadTs}`,
              channelId: channel,
              post: async (text: string) => {
                messages.push(text)
              },
              subscribe: async () => {},
            }
            const message = {
              text: event.text || "",
              raw: event,
              isMention: false,
              author: {
                userId: event.user || "",
                userName: event.username || event.user || "",
                fullName: event.username || event.user || "",
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

jest.mock("@chat-adapter/slack", () => ({
  createSlackAdapter: jest.fn(() => ({})),
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

import { context, db, docIds, encryption } from "@budibase/backend-core"
import {
  DocumentType,
  type Agent,
  type ChatConversation,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const SECRET_ENCODING_PREFIX = "bbai_enc::"

const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>

const secretMatch = (plain: string, encoded: string) => {
  if (!encoded.startsWith(SECRET_ENCODING_PREFIX)) {
    throw new Error("Encoded slack secret not properly configured.")
  }
  return encryption.compare(
    plain,
    encoded.substring(SECRET_ENCODING_PREFIX.length)
  )
}

describe("agent slack integration provisioning", () => {
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

  beforeEach(async () => {
    await config.newTenant()
    mockedWebhookChat.mockClear()
  })

  afterAll(() => {
    config.end()
  })

  it("provisions slack channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Slack Agent",
      slackIntegration: {
        botToken: "xoxb-token-1",
        signingSecret: "slack-signing-secret",
      },
    })

    const result = await config.api.agent.provisionSlackChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/slack/")
    expect(result.messagingEndpointUrl).toContain(
      `/${config.getProdWorkspaceId()}/`
    )
    expect(result.messagingEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.slackIntegration?.chatAppId).toEqual(result.chatAppId)
    expect(updated?.slackIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )
  })

  it("obfuscates slack secrets in responses and preserves them on update", async () => {
    const created = await config.api.agent.create({
      name: "Slack Obfuscation Agent",
      aiconfig: "test-config",
      slackIntegration: {
        botToken: "xoxb-token-2",
        signingSecret: "slack-signing-secret-2",
      },
    })

    expect(created.slackIntegration?.botToken).toEqual("********")
    expect(created.slackIntegration?.signingSecret).toEqual("********")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(a => a._id === created._id)
    expect(fetched?.slackIntegration?.botToken).toEqual("********")
    expect(fetched?.slackIntegration?.signingSecret).toEqual("********")

    const updated = await config.api.agent.update({
      ...(fetched as NonNullable<typeof fetched>),
      live: true,
    })
    expect(updated.slackIntegration?.botToken).toEqual("********")
    expect(updated.slackIntegration?.signingSecret).toEqual("********")

    const persisted = await getPersistedAgent(created._id)
    expect(
      secretMatch("xoxb-token-2", persisted.slackIntegration!.botToken!)
    ).toBeTrue()
    expect(
      secretMatch(
        "slack-signing-secret-2",
        persisted.slackIntegration!.signingSecret!
      )
    ).toBeTrue()
  })

  it("returns a validation error when slack settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Slack Settings",
    })

    await config.api.agent.provisionSlackChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  describe("slack webhook incoming messages", () => {
    const postSlackMessage = async ({
      path,
      body,
    }: {
      path: string
      body: Record<string, unknown>
    }) => await config.getRequest()!.post(path).send(body).expect(200)

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

    const setupProvisionedSlackAgent = async () => {
      const agent = await config.api.agent.create({
        name: "Slack Incoming Messages Agent",
        slackIntegration: {
          botToken: "xoxb-token-3",
          signingSecret: "slack-signing-secret-3",
        },
      })
      const channel = await config.api.agent.provisionSlackChannel(agent._id!)
      await config.publish()
      return { agent, chatAppId: channel.chatAppId }
    }

    it("creates a conversation from an incoming message", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      const firstPart =
        mockedWebhookChat.mock.calls[0]?.[0].chat.messages[0]?.parts[0]
      expect(firstPart?.type === "text" ? firstPart.text : undefined).toEqual(
        "hello slack"
      )

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.channel?.provider).toEqual("slack")
      expect(conversations[0]?.messages).toHaveLength(2)
    })

    it("reuses the existing conversation for subsequent messages in the same scope", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "first",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "second",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.200",
            team_id: "T123",
          },
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

    it("creates a separate conversation for a different thread", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "first thread message",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            thread_ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "second thread message",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.200",
            thread_ts: "1700000000.200",
            team_id: "T123",
          },
        },
      })

      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(2)
      const userTextsByConversation = conversations
        .map(conversation =>
          conversation.messages
            .filter(message => message.role === "user")
            .map(
              message =>
                message.parts?.[0]?.type === "text" && message.parts[0].text
            )
        )
        .sort((a, b) => {
          const first = typeof a[0] === "string" ? a[0] : ""
          const second = typeof b[0] === "string" ? b[0] : ""
          return first.localeCompare(second)
        })

      expect(userTextsByConversation).toEqual([
        ["first thread message"],
        ["second thread message"],
      ])
    })
  })
})
