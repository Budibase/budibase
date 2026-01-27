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
