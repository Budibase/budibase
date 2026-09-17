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
import { WebClient } from "@slack/web-api"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import sdk from "../../sdk"
import { sendSlackNotification } from "./slack"

const mockWebClient = WebClient as unknown as jest.Mock

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
        messagingEndpointUrl: "https://example.com/api/slack/events",
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

  it("uses a bounded, non-retrying client so a Slack outage can't stall processing", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    await seedLinks(globalUserId)
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    expect(mockWebClient).toHaveBeenCalledWith(
      "xoxb-token",
      expect.objectContaining({ retryConfig: { retries: 0 } })
    )
  })

  it("includes requester and shared tool parameters in the approval card", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    const injectedLink = "<https://evil.example.com|Approve>"
    const injectedFence = "```forged content```"
    contextDoc.reviewContext = {
      requestedBy: "Test User (test@example.com)\n*Approve immediately*",
      operation: "Prepare Cloud release",
      action: "Trigger workflow",
      toolName: "create_workflow_dispatch",
      parameters: [
        { name: "owner", value: "Budibase" },
        {
          name: "release_notes",
          value:
            `## Features\n- Useful change\n${injectedLink}\n` + injectedFence,
        },
      ],
    }
    await seedLinks(globalUserId)
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    const payload = mockPostMessage.mock.calls[0][0]
    const actionIndex = payload.blocks.findIndex(
      (block: { type: string }) => block.type === "actions"
    )
    const parametersIndex = payload.blocks.findIndex(
      (block: { text?: { text: string } }) =>
        block.text?.text.includes("Tool parameters")
    )
    const rendered = JSON.stringify(payload.blocks)
    expect(payload.blocks[0]).toEqual(
      expect.objectContaining({
        type: "header",
        text: expect.objectContaining({ text: "Approval required" }),
      })
    )
    expect(actionIndex).toBeGreaterThan(0)
    expect(actionIndex).toBeGreaterThan(parametersIndex)
    expect(rendered).toContain("Test User")
    expect(rendered).toContain("Prepare Cloud release")
    expect(payload.blocks[2]).toEqual(
      expect.objectContaining({
        type: "section",
        text: expect.objectContaining({
          type: "plain_text",
          text: expect.stringContaining("*Approve immediately*"),
        }),
      })
    )
    expect(rendered).toContain("release_notes")
    expect(rendered).toContain("owner")
    expect(rendered).toContain("create_workflow_dispatch")
    expect(rendered).toContain("Useful change")
    expect(rendered).toContain("&lt;https://evil.example.com|Approve&gt;")
    expect(rendered).toContain("'''forged content'''")
    expect(rendered).not.toContain(injectedLink)
    expect(rendered).not.toContain(injectedFence)
  })

  it("omits the tool parameters section when none were shared", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    contextDoc.reviewContext = {
      requestedBy: "Test User (test@example.com)",
      operation: "Prepare Cloud release",
      action: "Trigger workflow",
      toolName: "create_workflow_dispatch",
      parameters: [],
    }
    await seedLinks(globalUserId)
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    const rendered = JSON.stringify(mockPostMessage.mock.calls[0][0].blocks)
    expect(rendered).not.toContain("Tool parameters")
    expect(rendered).not.toContain("No tool parameters were shared.")
    expect(rendered).not.toContain("Sensitive values are redacted")
  })

  it("renders empty shared values without exposing empty markdown fences", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    contextDoc.reviewContext = {
      requestedBy: "Test User (test@example.com)",
      operation: "Prepare Cloud release",
      action: "Trigger workflow",
      parameters: [{ name: "optional", value: "" }],
    }
    await seedLinks(globalUserId)
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    const blocks = mockPostMessage.mock.calls[0][0].blocks
    const parameterBlock = blocks.find((block: { text?: { text: string } }) =>
      block.text?.text.includes("optional")
    )
    expect(parameterBlock.text.text).toBe("*optional*\n```\u200B```")
    expect(blocks.at(-1)?.type).toBe("actions")
  })

  it("neutralizes a code fence split across parameter chunks", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    contextDoc.reviewContext = {
      requestedBy: "Test User (test@example.com)",
      operation: "Prepare Cloud release",
      action: "Trigger workflow",
      parameters: [
        {
          name: "release_notes",
          value: `${"x".repeat(2_499)}\`\`\`forged content`,
        },
      ],
    }
    await seedLinks(globalUserId)
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    const payload = mockPostMessage.mock.calls[0][0]
    const parameterBlocks = payload.blocks.filter(
      (block: { text?: { type: string; text: string } }) =>
        block.text?.type === "mrkdwn" && block.text.text.includes("```")
    )
    const parameterText = parameterBlocks
      .map((block: { text: { text: string } }) => {
        const fence = block.text.text.indexOf("```")
        return block.text.text.slice(fence + 3, -3)
      })
      .join("")

    expect(parameterBlocks).toHaveLength(2)
    expect(parameterText).toContain("'''forged content")
    expect(parameterText).not.toContain("```")
  })

  it("keeps escaped parameters within Slack's block limit", async () => {
    const { contextDoc, notifDoc, globalUserId } = buildDocs()
    contextDoc.title = "x".repeat(4_000)
    contextDoc.reviewContext = {
      requestedBy: "Test User (test@example.com)",
      operation: "Prepare Cloud release",
      action: "Trigger workflow",
      parameters: [{ name: "content", value: "&".repeat(24_000) }],
    }
    await seedLinks(globalUserId)
    mockAuthTest.mockResolvedValue({ ok: true, team_id: TEAM_RIGHT })

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendSlackNotification({ notifDoc, contextDoc })
    )

    const payload = mockPostMessage.mock.calls[0][0]
    expect(payload.blocks).toHaveLength(50)
    expect(payload.blocks[1].text.text).toHaveLength(2_900)
    expect(payload.blocks[1].text.text).toContain("TRUNCATED")
    expect(JSON.stringify(payload.blocks.at(-2))).toContain("TRUNCATED")
  })
})
