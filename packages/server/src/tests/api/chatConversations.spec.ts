import { context, docIds, roles } from "@budibase/backend-core"
import type {
  ChatApp,
  ChatConversation,
  User,
} from "@budibase/types"
import TestConfiguration from "../utilities/TestConfiguration"

describe("chat conversations authorization", () => {
  const config = new TestConfiguration()
  let userA: User
  let userB: User
  let chatApp: ChatApp
  let convoA: ChatConversation
  let convoB: ChatConversation

  beforeAll(async () => {
    await config.init("chat-conversation-scope")
    userA = config.getUser()
    userB = await config.createUser({
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
        chatApp = {
          _id: docIds.generateChatAppID(),
          agentIds: ["agent-1"],
          createdAt: now,
          updatedAt: now,
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
        await db.put(chatApp)
        await db.put(convoA)
        await db.put(convoB)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  const headersForUser = async (user: User) =>
    await config.withUser(user, async () =>
      config.defaultHeaders({}, true)
    )

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
      .get(
        `/api/chatapps/${chatApp._id}/conversations/${convoB._id}`
      )
      .set(headers)

    expect(res.status).toBe(403)
  })

  it("allows a user to fetch their own conversation", async () => {
    const headers = await headersForUser(userB)

    const res = await config
      .getRequest()!
      .get(
        `/api/chatapps/${chatApp._id}/conversations/${convoB._id}`
      )
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(convoB._id)
  })
})
