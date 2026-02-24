interface MockTeamsRequest {
  headers?: {
    authorization?: unknown
  }
  body?: unknown
}

interface MockTeamsResponse {
  status: (statusCode: number) => {
    send: (body: unknown) => void
  }
}

interface MockTeamsTurnContext {
  activity: unknown
  sendActivity: (message: string) => Promise<void>
}

interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
}

jest.mock("@microsoft/agents-hosting", () => {
  const authorizeJWT = jest.fn(
    () =>
      async (
        request: MockTeamsRequest,
        response: MockTeamsResponse,
        next: () => void
      ) => {
        const authorization = request.headers?.authorization
        if (typeof authorization !== "string") {
          response.status(401).send({
            "jwt-auth-error": "authorization header not found",
          })
          return
        }
        if (authorization !== "Bearer valid-token") {
          response.status(401).send({
            "jwt-auth-error": "invalid token",
          })
          return
        }
        next()
      }
  )

  class CloudAdapter {
    async process(
      request: MockTeamsRequest,
      response: MockTeamsResponse,
      logic: (turnContext: MockTeamsTurnContext) => Promise<void>
    ) {
      const sentActivities: string[] = []
      await logic({
        activity: request.body,
        sendActivity: async (message: string) => {
          sentActivities.push(message)
        },
      })
      response.status(200).send({ messages: sentActivities })
    }
  }

  return {
    authorizeJWT,
    CloudAdapter,
    getAuthConfigWithDefaults: jest.fn((config: unknown) => config),
  }
})

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

import { context, docIds } from "@budibase/backend-core"
import {
  DocumentType,
  type Agent,
  type ChatConversation,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>

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

  it("returns a validation error when teams app password is missing", async () => {
    const agent = await config.api.agent.create({
      name: "Missing Teams Password",
      MSTeamsIntegration: {
        appId: "teams-app-id",
      },
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

    it("rejects invalid bearer tokens", async () => {
      const agent = await config.api.agent.create({
        name: "Teams Invalid Token Agent",
        MSTeamsIntegration: {
          appId: "teams-app-id",
          appPassword: "teams-app-password",
        },
      })
      await config.publish()

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .set("Authorization", "Bearer not-a-real-token")
        .send({})
        .expect(401)

      expect(response.body["jwt-auth-error"]).toBeTruthy()
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
        },
      })
      const channel = await config.api.agent.provisionMSTeamsChannel(agent._id!)
      await config.publish()
      return { agent, chatAppId: channel.chatAppId }
    }

    it("creates a conversation from an incoming ask message", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: "ask hello teams",
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
      expect(conversations[0]?.messages).toHaveLength(2)
    })

    it("reuses the existing conversation for subsequent messages in the same scope", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: "ask first",
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
          text: "ask second",
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
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-new-1",
          type: "message",
          text: "new",
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

    it("deduplicates retried incoming activities by activity id", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const payload = {
        id: "activity-dedupe-1",
        type: "message",
        text: "ask dedupe me",
        from: { id: "user-1", name: "Teams User" },
        conversation: { id: "conversation-1", conversationType: "personal" },
        channelData: { tenant: { id: "tenant-1" } },
      }

      await postTeamsMessage({ path, body: payload })
      const duplicateResponse = await postTeamsMessage({ path, body: payload })

      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(duplicateResponse.body.messages).toEqual([])

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      const userMessages = conversations[0]!.messages.filter(
        message => message.role === "user"
      )
      expect(userMessages).toHaveLength(1)
    })
  })
})
