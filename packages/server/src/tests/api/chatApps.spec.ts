import { context, docIds } from "@budibase/backend-core"
import type { ChatApp } from "@budibase/types"
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
          enabledAgents: [{ agentId: "agent-1" }],
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

  it("rejects enabledAgents entries without agentId", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      enabledAgents: [{}],
    })

    expect(res.status).toBe(400)
  })

  it("rejects enabledAgents entries with empty agentId", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      enabledAgents: [{ agentId: "" }],
    })

    expect(res.status).toBe(400)
  })

  it("rejects null enabledAgents", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      enabledAgents: null,
    })

    expect(res.status).toBe(400)
  })

  it("allows empty enabledAgents", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      enabledAgents: [],
    })

    expect(res.status).toBe(200)
    expect(res.body.enabledAgents).toEqual([])
  })

  it("assigns default when missing", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      enabledAgents: [{ agentId: "agent-1" }, { agentId: "agent-2" }],
    })

    expect(res.status).toBe(200)
    expect(res.body.enabledAgents).toEqual([
      { agentId: "agent-1", default: true },
      { agentId: "agent-2", default: false },
    ])
  })

  it("rejects multiple default agents", async () => {
    const res = await updateChatApp({
      _id: chatApp._id,
      _rev: chatApp._rev,
      enabledAgents: [
        { agentId: "agent-1", default: true },
        { agentId: "agent-2", default: true },
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

  it("rejects null enabledAgents", async () => {
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const payload = {
          enabledAgents: null,
        } as unknown as Omit<ChatApp, "_id" | "_rev">

        await expect(sdk.ai.chatApps.create(payload)).rejects.toThrow(
          "enabledAgents must contain valid agentId entries"
        )
      }
    )
  })
})
