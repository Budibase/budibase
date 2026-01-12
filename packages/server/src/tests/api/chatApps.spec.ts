import { context, docIds } from "@budibase/backend-core"
import type { ChatApp } from "@budibase/types"
import TestConfiguration from "../utilities/TestConfiguration"

describe("chat apps suggested questions", () => {
  const config = new TestConfiguration()
  let chatApp: ChatApp

  beforeAll(async () => {
    await config.init("chat-apps-suggested-questions")
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        const baseChatApp: ChatApp = {
          _id: docIds.generateChatAppID(),
          agentId: "agent-1",
          createdAt: now,
          updatedAt: now,
        }
        const { rev } = await db.put(baseChatApp)
        chatApp = { ...baseChatApp, _rev: rev }
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  it("returns default suggested questions when missing", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config.getRequest()!.get("/api/chatapps").set(headers)

    expect(res.status).toBe(200)
    expect(res.body.suggestedQuestions).toEqual([])
  })

  it("persists updated suggested questions", async () => {
    const headers = await config.defaultHeaders({}, true)
    const suggestedQuestions = [
      {
        id: "q1",
        text: "What can you help with?",
        enabled: true,
        order: 1,
      },
      {
        id: "q2",
        text: "Show me recent activity",
        enabled: false,
        order: 2,
      },
    ]

    const res = await config
      .getRequest()!
      .put(`/api/chatapps/${chatApp._id}`)
      .set(headers)
      .send({
        ...chatApp,
        suggestedQuestions,
      })

    expect(res.status).toBe(200)
    expect(res.body.suggestedQuestions).toEqual(suggestedQuestions)

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const stored = await db.get<ChatApp>(chatApp._id!)
        expect(stored.suggestedQuestions).toEqual(suggestedQuestions)
      }
    )
  })
})
