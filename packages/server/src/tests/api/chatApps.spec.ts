import { context, docIds, roles } from "@budibase/backend-core"
import type { Agent, ChatApp, ChatConversation, User } from "@budibase/types"
import sdk from "../../sdk"
import TestConfiguration from "../utilities/TestConfiguration"

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

  it("normalizes agents to membership-only entries", async () => {
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const created = await sdk.ai.chatApps.create({
          agents: [
            {
              agentId: "agent-1",
              isEnabled: true,
              isDefault: true,
              roleId: roles.BUILTIN_ROLE_IDS.BASIC,
            } as any,
          ],
        })

        expect(created.agents).toEqual([{ agentId: "agent-1" }])
      }
    )
  })
})

describe("chat route access", () => {
  const config = new TestConfiguration()
  let chatApp: ChatApp
  let basicUser: User
  let liveAgentId: string
  let offlineAgentId: string

  beforeAll(async () => {
    await config.init("chat-route-access")
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
        const liveAgent: Agent = {
          _id: docIds.generateAgentID(),
          name: "Support agent",
          aiconfig: "",
          live: true,
          icon: "robot",
          iconColor: "#6a9bcc",
          createdAt: now,
          operations: [
            {
              id: "operation_1",
              name: "Main operation",
              live: false,
              enabledTools: [],
              allowKnowledgeSourceDownload: true,
            },
          ],
        }
        await db.put(liveAgent)
        liveAgentId = liveAgent._id!

        const offlineAgent: Agent = {
          _id: docIds.generateAgentID(),
          name: "Offline support agent",
          aiconfig: "",
          live: false,
          icon: "robot",
          iconColor: "#9f8cd1",
          createdAt: now,
          operations: [
            {
              id: "operation_1",
              name: "Main operation",
              live: false,
              enabledTools: [],
              allowKnowledgeSourceDownload: true,
            },
          ],
        }
        await db.put(offlineAgent)
        offlineAgentId = offlineAgent._id!

        const doc: ChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: liveAgentId }, { agentId: offlineAgentId }],
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
          agentId: liveAgentId,
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
        agentId: liveAgentId,
        title: "basic user conversation",
      })

    expect(res.status).toBe(201)
    expect(res.body.chatAppId).toBe(chatApp._id)
    expect(res.body.agentId).toBe(liveAgentId)
  })

  it("blocks basic users from POST /api/chatapps/:chatAppId/conversations for offline agents", async () => {
    const headers = await headersForUser(basicUser)
    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)
      .send({
        chatAppId: chatApp._id,
        agentId: offlineAgentId,
        title: "offline conversation",
      })

    expect(res.status).toBe(400)
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
        agentId: liveAgentId,
        messages: [],
      })

    expect(res.status).toBe(400)
  })
})
