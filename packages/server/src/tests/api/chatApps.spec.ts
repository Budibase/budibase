import { context, docIds, roles } from "@budibase/backend-core"
import type {
  Agent,
  ChatApp,
  ChatConversation,
  User,
} from "@budibase/types"
import sdk from "../../sdk"
import TestConfiguration from "../utilities/TestConfiguration"

describe("chat apps validation", () => {
  const config = new TestConfiguration()
  let chatApp: ChatApp

  beforeAll(async () => {
    await config.init("chat-app-validation")

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()

        const doc: ChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: "agent-1", isEnabled: true, isDefault: false }],
          createdAt: now,
          updatedAt: now,
        }

        const { rev } = await db.put(doc)
        chatApp = { ...doc, _rev: rev }
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  const updateChatApp = async (body: any) => {
    const headers = await config.defaultHeaders({}, true)
    const res = await config
      .getRequest()!
      .put(`/api/chatapps/${chatApp._id}`)
      .set(headers)
      .send(body)

    if (res.status === 200 && res.body?._rev) {
      chatApp = { ...chatApp, _rev: res.body._rev }
    }

    return res
  }

  it("rejects agents entries without agentId", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      agents: [{}],
    })

    expect(res.status).toBe(400)
  })

  it("rejects agents entries with empty agentId", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      agents: [{ agentId: "" }],
    })

    expect(res.status).toBe(400)
  })

  it("rejects null agents", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      agents: null,
    })

    expect(res.status).toBe(400)
  })

  it("allows empty agents", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      agents: [],
    })

    expect(res.status).toBe(200)
    expect(res.body.agents).toEqual([])
  })

  it("rejects invalid conversation starters", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      agents: [
        {
          agentId: "agent-1",
          isEnabled: true,
          isDefault: false,
          conversationStarters: [{ prompt: 123 }],
        },
      ],
    })

    expect(res.status).toBe(400)
  })

  it("rejects more than three starters", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      agents: [
        {
          agentId: "agent-1",
          isEnabled: true,
          isDefault: false,
          conversationStarters: [
            { prompt: "One" },
            { prompt: "Two" },
            { prompt: "Three" },
            { prompt: "Four" },
          ],
        },
      ],
    })

    expect(res.status).toBe(400)
  })
})

describe("chat apps create validation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("chat-app-create-validation")
  })

  afterAll(() => {
    config.end()
  })

  it("rejects null agents", async () => {
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const payload = {
          agents: null,
        } as unknown as Omit<ChatApp, "_id" | "_rev">

        await expect(sdk.ai.chatApps.create(payload)).rejects.toThrow(
          "agents must contain valid agentId entries"
        )
      }
    )
  })
})

describe("chat route auth split", () => {
  const config = new TestConfiguration()
  let chatApp: ChatApp
  let basicUser: User
  let agentId: string
  let disabledAgentId: string

  beforeAll(async () => {
    await config.init("chat-route-auth-split")
    basicUser = await config.createUser({
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
      builder: { global: false },
      admin: { global: false },
    })

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        const agent: Agent = {
          _id: docIds.generateAgentID(),
          name: "Support agent",
          aiconfig: "",
          live: true,
          icon: "robot",
          iconColor: "#6a9bcc",
          createdAt: now,
          enabledTools: [],
        }
        await db.put(agent)
        agentId = agent._id!

        const disabledAgent: Agent = {
          _id: docIds.generateAgentID(),
          name: "Disabled support agent",
          aiconfig: "",
          live: true,
          icon: "robot",
          iconColor: "#9f8cd1",
          createdAt: now,
          enabledTools: [],
        }
        await db.put(disabledAgent)
        disabledAgentId = disabledAgent._id!

        const doc: ChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [
            { agentId, isEnabled: true, isDefault: true },
            { agentId: disabledAgentId, isEnabled: false, isDefault: false },
          ],
          live: true,
          createdAt: now,
          updatedAt: now,
        }
        const { rev } = await db.put(doc)
        chatApp = { ...doc, _rev: rev }
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  const headersForUser = async (user: User) =>
    await config.withUser(user, async () => config.defaultHeaders({}, true))

  const setChatAppLive = async (live: boolean) => {
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const existing = await db.get<ChatApp>(chatApp._id!)
        const updated: ChatApp = {
          ...existing,
          live,
          updatedAt: new Date().toISOString(),
        }
        const { rev } = await db.put(updated)
        chatApp = { ...updated, _rev: rev }
      }
    )
  }

  const createConversation = async (title: string) => {
    let conversation: ChatConversation | undefined
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        const doc: ChatConversation = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          agentId,
          userId: basicUser._id!,
          messages: [],
          title,
          createdAt: now,
          updatedAt: now,
        }
        await db.put(doc)
        conversation = doc
      }
    )
    return conversation!
  }

  it("allows basic users to access GET /api/chatapps", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config.getRequest()!.get("/api/chatapps").set(headers)

    expect(res.status).toBe(200)
    expect(res.body?._id).toBe(chatApp._id)
  })

  it("allows basic users to access GET /api/chatapps/:chatAppId", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body?._id).toBe(chatApp._id)
  })

  it("returns 404 when GET /api/chatapps/:chatAppId targets a missing chat app", async () => {
    const headers = await headersForUser(basicUser)
    const missingChatAppId = docIds.generateChatAppID()
    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${missingChatAppId}`)
      .set(headers)

    expect(res.status).toBe(404)
  })

  it("blocks basic users from GET /api/chatapps/:chatAppId when chat app is not live", async () => {
    await setChatAppLive(false)
    const headers = await headersForUser(basicUser)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}`)
      .set(headers)

    expect(res.status).toBe(403)

    await setChatAppLive(true)
  })

  it("allows builders to access GET /api/chatapps/:chatAppId when chat app is not live", async () => {
    await setChatAppLive(false)
    const headers = await headersForUser(config.getUser())

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}`)
      .set(headers)

    expect(res.status).toBe(200)

    await setChatAppLive(true)
  })

  it("allows basic users to access GET /api/chatapps/:chatAppId/agents", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/agents`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body.agents).toHaveLength(1)
    expect(res.body.agents[0]).toEqual({
      _id: agentId,
      name: "Support agent",
      icon: "robot",
      iconColor: "#6a9bcc",
      live: true,
    })
    expect(res.body.agents[0]).not.toHaveProperty("aiconfig")
    expect(
      res.body.agents.map((agent: { _id: string }) => agent._id)
    ).not.toContain(disabledAgentId)
  })

  it("blocks basic users from PUT /api/chatapps/:chatAppId", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .put(`/api/chatapps/${chatApp._id}`)
      .set(headers)
      .send({
        _id: chatApp._id,
        _rev: chatApp._rev,
        agents: chatApp.agents,
      })

    expect(res.status).toBe(403)
  })

  it("blocks basic users from POST /api/chatapps/:chatAppId/agent", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/agent`)
      .set(headers)
      .send({ agentId })

    expect(res.status).toBe(403)
  })

  it("allows basic users to access GET /api/chatapps/:chatAppId/conversations", async () => {
    const headers = await headersForUser(basicUser)
    const conversation = await createConversation("history conversation")
    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body.map((chat: ChatConversation) => chat._id)).toContain(
      conversation._id
    )
  })

  it("blocks basic users from GET /api/chatapps/:chatAppId/conversations when chat app is not live", async () => {
    await setChatAppLive(false)
    const headers = await headersForUser(basicUser)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)

    expect(res.status).toBe(403)

    await setChatAppLive(true)
  })

  it("allows basic users to access GET /api/chatapps/:chatAppId/conversations/:chatConversationId", async () => {
    const headers = await headersForUser(basicUser)
    const conversation = await createConversation("single conversation")
    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations/${conversation._id}`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(conversation._id)
  })

  it("allows basic users to access POST /api/chatapps/:chatAppId/conversations", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)
      .send({
        chatAppId: chatApp._id,
        agentId,
        title: "basic user conversation",
      })

    expect(res.status).toBe(201)
    expect(res.body.chatAppId).toBe(chatApp._id)
    expect(res.body.agentId).toBe(agentId)
  })

  it("allows basic users to access DELETE /api/chatapps/:chatAppId/conversations/:chatConversationId", async () => {
    const headers = await headersForUser(basicUser)
    const conversation = await createConversation("delete conversation")
    const res = await config
      .getRequest()!
      .delete(`/api/chatapps/${chatApp._id}/conversations/${conversation._id}`)
      .set(headers)

    expect(res.status).toBe(204)
  })

  it("allows basic users to access POST /api/chatapps/:chatAppId/conversations/:chatConversationId/stream", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        chatAppId: "mismatched-chat-app-id",
        agentId,
        messages: [],
      })

    expect(res.status).toBe(400)
  })

  it("blocks basic users from POST /api/chatapps/:chatAppId/conversations/:chatConversationId/stream when chat app is not live", async () => {
    await setChatAppLive(false)
    const headers = await headersForUser(basicUser)

    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        chatAppId: chatApp._id,
        agentId,
        messages: [],
      })

    expect(res.status).toBe(403)

    await setChatAppLive(true)
  })
})
