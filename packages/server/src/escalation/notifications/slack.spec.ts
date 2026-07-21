const mockPostMessage = jest.fn()
const mockAuthTest = jest.fn()

jest.mock("@slack/web-api", () => ({
  WebClient: jest.fn(() => ({
    auth: { test: mockAuthTest },
    chat: { postMessage: mockPostMessage },
  })),
}))

jest.mock("@chat-adapter/slack", () => ({
  createSlackAdapter: jest.fn(() => ({})),
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
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import sdk from "../../sdk"
import { sendSlackNotification } from "./slack"

// The bot lives in TEAM_RIGHT, so a DM to this user must go to their identity
// in that team. TEAM_WRONG sorts lexically first ("0" < "9"), so an unscoped
// lookup would pick it - proving the cross-workspace leak.
const TEAM_WRONG = "T00000WRONG"
const TEAM_RIGHT = "T99999RIGHT"
const USER_WRONG = "U00000WRONG"
const USER_RIGHT = "U99999RIGHT"

describe("sendSlackNotification", () => {
  const config = new TestConfiguration()

  let agent: Agent

  const seedLinks = async (globalUserId: string) => {
    await config.doInTenant(async () => {
      // Seed the wrong-team link first so it wins the unscoped lookup order.
      await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
        provider: AgentChannelProvider.SLACK,
        externalUserId: USER_WRONG,
        teamId: TEAM_WRONG,
        globalUserId,
        linkedBy: globalUserId,
      })
      await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
        provider: AgentChannelProvider.SLACK,
        externalUserId: USER_RIGHT,
        teamId: TEAM_RIGHT,
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
        type: EscalationNotificationChannel.SLACK,
        config: { globalUserId },
      },
      sentAt: new Date().toISOString(),
    }
    return { contextDoc, notifDoc, globalUserId }
  }

  beforeEach(async () => {
    await config.newTenant()
    mockPostMessage.mockReset().mockResolvedValue({ ok: true })
    mockAuthTest.mockReset()
    // Agent save resolves the workspace via auth.test; make it fail so the
    // agent is stored with no teamId - the scenario this fix targets.
    mockAuthTest.mockRejectedValue(new Error("invalid_auth"))
    agent = await config.api.agent.create({
      name: "Escalation Slack Agent",
      slackIntegration: {
        botToken: "xoxb-token",
        signingSecret: "signing-secret",
      },
    })
  })

  afterAll(() => {
    config.end()
  })

  it("does not DM when the bot workspace cannot be resolved", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    await seedLinks(globalUserId)
    // No stored teamId and auth.test keeps failing - unresolvable workspace.
    mockAuthTest.mockRejectedValue(new Error("invalid_auth"))

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    expect(mockPostMessage).not.toHaveBeenCalled()
  })

  it("DMs the identity scoped to the bot's workspace when resolvable", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    await seedLinks(globalUserId)
    // auth.test now resolves the bot's real workspace.
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    expect(mockPostMessage).toHaveBeenCalledTimes(1)
    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({ channel: USER_RIGHT })
    )
  })
})
