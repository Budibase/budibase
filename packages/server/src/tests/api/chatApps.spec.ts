import { context, docIds, roles } from "@budibase/backend-core"
import type { ChatApp, User } from "@budibase/types"
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
        const doc: ChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: "agent-1", isEnabled: true, isDefault: true }],
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

  it("allows basic users to access runtime chat endpoints", async () => {
    const headers = await headersForUser(basicUser)

    const fetchRes = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}`)
      .set(headers)

    const createRes = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)
      .send({
        chatAppId: chatApp._id,
        agentId: "agent-1",
        title: "basic user conversation",
      })

    const historyRes = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)

    expect(fetchRes.status).toBe(200)
    expect(createRes.status).toBe(201)
    expect(historyRes.status).toBe(200)
  })

  it("blocks basic users from control chat endpoints", async () => {
    const headers = await headersForUser(basicUser)

    const updateRes = await config
      .getRequest()!
      .put(`/api/chatapps/${chatApp._id}`)
      .set(headers)
      .send({
        _id: chatApp._id,
        _rev: chatApp._rev,
        agents: chatApp.agents,
      })

    const setAgentRes = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/agent`)
      .set(headers)
      .send({ agentId: "agent-1" })

    expect(updateRes.status).toBe(403)
    expect(setAgentRes.status).toBe(403)
  })
})
