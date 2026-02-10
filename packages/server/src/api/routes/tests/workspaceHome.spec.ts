import { Header, context, docIds, roles } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { ChatApp, ChatConversation, DocumentType } from "@budibase/types"
import tk from "timekeeper"

import * as setup from "./utilities"

describe("/workspace/home/metrics", () => {
  const METRICS_FRESH_TTL_MS = 10 * 60 * 1000
  const config = setup.getConfig()
  const request = setup.getRequest()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    setup.afterAll()
  })

  beforeEach(async () => {
    tk.reset()
    await config.newTenant()
  })

  afterEach(() => {
    tk.reset()
    jest.restoreAllMocks()
  })

  it("returns user access count for the workspace", async () => {
    tk.freeze(new Date(2026, 0, 20, 12, 0, 0, 0))
    const prodWorkspaceId = config.getProdWorkspaceId()

    const initial = await request
      .get("/api/workspace/home/metrics")
      .set(config.defaultHeaders())
      .expect(200)

    await config.createUser({
      roles: { [prodWorkspaceId]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })
    await config.createUser({
      roles: { [prodWorkspaceId]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })
    await config.createUser({
      roles: { [prodWorkspaceId]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })

    tk.travel(Date.now() + METRICS_FRESH_TTL_MS + 1)

    const res = await request
      .get("/api/workspace/home/metrics")
      .set(config.defaultHeaders())
      .expect(200)

    expect(res.body.totalUsers).toEqual(initial.body.totalUsers + 3)
  })

  it("returns automation runs from quotas for the current quota month", async () => {
    await tk.withFreeze(new Date(2026, 0, 20, 12, 0, 0, 0), async () => {
      await config.withProdApp(async () => {
        await quotas.addAutomation(async () => undefined, {
          automationId: "au_test",
        })
        await quotas.addAutomation(async () => undefined, {
          automationId: "au_test",
        })
      })

      const res = await request
        .get("/api/workspace/home/metrics")
        .set(config.defaultHeaders())
        .expect(200)

      expect(res.body.automationRunsThisMonth).toEqual(2)
      expect(res.body.agentActionsThisMonth).toEqual(0)

      expect(new Date(res.body.periodStart)).toEqual(new Date(2026, 0, 1))
      expect(new Date(res.body.periodEnd)).toEqual(new Date(2026, 1, 1))
    })
  })

  it("returns 400 if workspace context is missing", async () => {
    const headers = config.defaultHeaders()
    const { [Header.APP_ID]: _workspaceId, ...headersWithoutWorkspaceId } =
      headers

    await request
      .get("/api/workspace/home/metrics")
      .set(headersWithoutWorkspaceId)
      .expect(400)
  })

  it("returns user-scoped chats for workspace home", async () => {
    const user = config.getUser()
    const otherUser = await config.createUser({
      roles: { [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })

    await context.doInWorkspaceContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const now = new Date().toISOString()
      const chatApp: ChatApp = {
        _id: docIds.generateChatAppID(),
        agents: [{ agentId: "agent-1", isEnabled: true, isDefault: true }],
        createdAt: now,
        updatedAt: now,
      }

      const visibleConversation: ChatConversation = {
        _id: docIds.generateChatConversationID(),
        chatAppId: chatApp._id!,
        agentId: "agent-1",
        userId: user._id!,
        title: "Visible chat",
        messages: [],
        createdAt: now,
        updatedAt: now,
      }

      const hiddenConversation: ChatConversation = {
        _id: docIds.generateChatConversationID(),
        chatAppId: chatApp._id!,
        agentId: "agent-1",
        userId: otherUser._id!,
        title: "Hidden chat",
        messages: [],
        createdAt: now,
        updatedAt: now,
      }

      const openConversation: ChatConversation = {
        _id: docIds.generateChatConversationID(),
        chatAppId: chatApp._id!,
        agentId: "agent-1",
        userId: user._id!,
        title: "Shared chat",
        messages: [],
        createdAt: now,
        updatedAt: now,
      }

      await db.put(chatApp)
      await db.put(visibleConversation)
      await db.put(hiddenConversation)
      await db.put(openConversation)
    })

    const res = await request
      .get("/api/workspace/home/chats")
      .set(config.defaultHeaders())
      .expect(200)

    expect(res.body.chats).toHaveLength(2)
    expect(res.body.chats.map((chat: { title: string }) => chat.title)).toEqual(
      expect.arrayContaining(["Visible chat", "Shared chat"])
    )
  })

  it("returns empty chats when chat app is missing", async () => {
    await context.doInWorkspaceContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const chatApps = await db.allDocs<ChatApp>(
        docIds.getDocParams(DocumentType.CHAT_APP, undefined, {
          include_docs: true,
        })
      )

      for (const row of chatApps.rows) {
        if (row.doc) {
          await db.remove(row.doc)
        }
      }
    })

    const res = await request
      .get("/api/workspace/home/chats")
      .set(config.defaultHeaders())
      .expect(200)

    expect(res.body.chats).toEqual([])
  })
})
