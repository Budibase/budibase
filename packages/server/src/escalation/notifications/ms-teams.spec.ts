const mockFetch = jest.fn()

// Wrap in an arrow so mockFetch is read at call time, not when node-fetch is
// first required (which happens before this const initializes).
jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockFetch(...args),
}))

import { AgentChannelProvider } from "@budibase/types"
import {
  DocumentType,
  EscalationNotificationChannel,
  EscalationSource,
  SEPARATOR,
  type Agent,
  type EscalationContextDoc,
  type EscalationNotificationDoc,
} from "@budibase/types"
import { db } from "@budibase/backend-core"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import sdk from "../../sdk"
import { sendMSTeamsNotification } from "./ms-teams"

// The bot lives in TENANT_RIGHT, so a DM to this user must resolve to their
// identity in that tenant. TENANT_WRONG sorts lexically first ("a" < "z"), so
// an unscoped lookup would pick it - DMing a same-named user in another tenant.
const TENANT_WRONG = "tenant-a-wrong"
const TENANT_RIGHT = "tenant-z-right"
const USER_WRONG = "29:user-wrong"
const USER_RIGHT = "29:user-right"

const jsonResponse = (body: unknown) => ({
  ok: true,
  status: 200,
  json: async () => body,
  text: async () => JSON.stringify(body),
})

describe("sendMSTeamsNotification", () => {
  const config = new TestConfiguration()

  let agent: Agent

  const seedLinks = async (globalUserId: string) => {
    await config.doInTenant(async () => {
      await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
        provider: AgentChannelProvider.MSTEAMS,
        externalUserId: USER_WRONG,
        providerTenantId: TENANT_WRONG,
        globalUserId,
        linkedBy: globalUserId,
      })
      await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
        provider: AgentChannelProvider.MSTEAMS,
        externalUserId: USER_RIGHT,
        providerTenantId: TENANT_RIGHT,
        globalUserId,
        linkedBy: globalUserId,
      })
    })
  }

  const buildDocs = () => {
    const globalUserId = config.getUser()._id!
    // The agent doc lives in the dev workspace (no publish here), so resolve
    // the integration against it.
    const appId = config.getDevWorkspaceId()
    const contextDoc: EscalationContextDoc = {
      _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_1`,
      source: EscalationSource.OPERATION,
      appId,
      tenantId: config.getTenantId(),
      agentId: agent._id,
      operationId: "op_1",
      sessionId: "session_1",
      delay: 1000,
      resolution: "pending",
      title: "Procurement request",
      summary: "Approve 1500 pens",
    }
    const notifDoc: EscalationNotificationDoc = {
      _id: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}notif_1`,
      escalationId: "esc_1",
      appId,
      tenantId: config.getTenantId(),
      recipient: {
        type: EscalationNotificationChannel.MSTEAMS,
        config: { globalUserId },
      },
      sentAt: new Date().toISOString(),
    }
    return { contextDoc, notifDoc, globalUserId }
  }

  // Routes Teams API calls: OAuth token, create-conversation, post-activity.
  const routeFetch = () =>
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes("login.microsoftonline.com")) {
        return jsonResponse({ access_token: "token", expires_in: 3600 })
      }
      if (url.endsWith("/v3/conversations")) {
        return jsonResponse({ id: "conv_1" })
      }
      return jsonResponse({})
    })

  const createConversationCalls = () =>
    mockFetch.mock.calls.filter(([url]: [string]) =>
      String(url).endsWith("/v3/conversations")
    )

  const createAgent = async () =>
    config.api.agent.create({
      name: "Escalation Teams Agent",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: TENANT_RIGHT,
      },
    })

  // The API requires a non-empty tenantId, so simulate a legacy/edge agent
  // with no tenant by blanking it directly in the persisted doc.
  const blankAgentTenant = async (agentId: string) => {
    await db.doWithDB(config.getDevWorkspaceId(), async workspaceDb => {
      const persisted = (await workspaceDb.tryGet<Agent>(agentId))!
      delete persisted.MSTeamsIntegration!.tenantId
      await workspaceDb.put(persisted)
    })
  }

  beforeEach(async () => {
    await config.newTenant()
    mockFetch.mockReset()
    routeFetch()
  })

  afterAll(() => {
    config.end()
  })

  it("does not DM when the bot tenant cannot be resolved", async () => {
    agent = await createAgent()
    await blankAgentTenant(agent._id!)
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    await seedLinks(globalUserId)

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendMSTeamsNotification({ notifDoc, contextDoc })
    )

    expect(createConversationCalls()).toHaveLength(0)
  })

  it("DMs the identity scoped to the bot's tenant when resolvable", async () => {
    agent = await createAgent()
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    await seedLinks(globalUserId)

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendMSTeamsNotification({ notifDoc, contextDoc })
    )

    const [conversationCall] = createConversationCalls()
    expect(conversationCall).toBeDefined()
    const body = JSON.parse(conversationCall[1].body)
    expect(body.members).toEqual([{ id: USER_RIGHT }])
  })
})
