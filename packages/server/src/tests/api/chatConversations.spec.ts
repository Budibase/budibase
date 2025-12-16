import { context, docIds, roles } from "@budibase/backend-core"
import type { ChatApp, ChatConversation, User } from "@budibase/types"
import TestConfiguration from "../utilities/TestConfiguration"
import { prepareChatConversationForSave } from "../../api/controllers/ai/chatConversations"

describe("chat conversations authorization", () => {
  const config = new TestConfiguration()
  let userA: User
  let userB: User
  let chatApp: ChatApp
  let otherChatApp: ChatApp
  let convoA: ChatConversation
  let convoB: ChatConversation
  let otherAppConvo: ChatConversation

  beforeAll(async () => {
    await config.init("chat-conversation-scope")
    userA = config.getUser()
    userB = await config.createUser({
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
      builder: { global: true },
      admin: { global: false },
    })

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        chatApp = {
          _id: docIds.generateChatAppID(),
          agentId: "agent-1",
          createdAt: now,
        }
        convoA = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          userId: userA._id!,
          messages: [],
          title: "user A conversation",
          createdAt: now,
        }
        convoB = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          userId: userB._id!,
          messages: [],
          title: "user B conversation",
          createdAt: now,
        }
        otherChatApp = {
          _id: docIds.generateChatAppID(),
          agentId: "agent-2",
          createdAt: now,
        }
        otherAppConvo = {
          _id: docIds.generateChatConversationID(),
          chatAppId: otherChatApp._id!,
          userId: userA._id!,
          messages: [],
          title: "other app conversation",
          createdAt: now,
        }
        await db.put(chatApp)
        await db.put(convoA)
        await db.put(convoB)
        await db.put(otherChatApp)
        await db.put(otherAppConvo)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  const headersForUser = async (user: User) =>
    await config.withUser(user, async () => config.defaultHeaders({}, true))

  it("filters history results to the requesting user", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body.map((chat: ChatConversation) => chat._id)).toEqual([
      convoA._id,
    ])
  })

  it("blocks access to another user's conversation", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations/${convoB._id}`)
      .set(headers)

    expect(res.status).toBe(403)
  })

  it("allows a user to fetch their own conversation", async () => {
    const headers = await headersForUser(userB)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations/${convoB._id}`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(convoB._id)
  })

  it("blocks deleting a conversation from a different chat app", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .delete(`/api/chatapps/${chatApp._id}/conversations/${otherAppConvo._id}`)
      .set(headers)

    expect(res.status).toBe(404)
  })
})

describe("prepareChatConversationForSave", () => {
  const now = new Date("2024-01-01T00:00:00.000Z")

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it("preserves existing createdAt and updates updatedAt", () => {
    const existingChat: ChatConversation = {
      _id: "chat-1",
      _rev: "1",
      chatAppId: "chat-app-1",
      userId: "user-1",
      title: "old title",
      messages: [],
      createdAt: "2023-12-31T12:00:00.000Z",
      updatedAt: "2023-12-31T12:00:00.000Z",
    }

    const result = prepareChatConversationForSave({
      chatId: existingChat._id!,
      chatAppId: existingChat.chatAppId,
      userId: existingChat.userId!,
      title: "new title",
      messages: [],
      chat: existingChat,
      existingChat,
    })

    expect(result.createdAt).toEqual(existingChat.createdAt)
    expect(result.updatedAt).toEqual(now.toISOString())
    expect(result._rev).toEqual(existingChat._rev)
  })

  it("sets createdAt when saving a new conversation", () => {
    const chat: ChatConversation = {
      _id: "chat-2",
      chatAppId: "chat-app-2",
      userId: "user-2",
      title: "new chat",
      messages: [],
    }

    const result = prepareChatConversationForSave({
      chatId: chat._id!,
      chatAppId: chat.chatAppId,
      userId: chat.userId!,
      title: chat.title,
      messages: [],
      chat,
    })

    expect(result.createdAt).toEqual(now.toISOString())
    expect(result.updatedAt).toEqual(now.toISOString())
  })
})

describe("chat conversation path validation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("chat-conversation-validation")
  })

  afterAll(() => {
    config.end()
  })

  it("rejects mismatched chatAppId between path and body", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post("/api/chatapps/chatapp-path/conversations/new/stream")
      .set(headers)
      .send({
        chatAppId: "chatapp-body",
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })

  it("rejects mismatched chatConversationId between path and body", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post("/api/chatapps/chatapp-path/conversations/convo-path/stream")
      .set(headers)
      .send({
        chatAppId: "chatapp-path",
        _id: "convo-body",
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })
})
