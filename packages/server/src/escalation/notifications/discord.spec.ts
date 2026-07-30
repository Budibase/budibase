const mockFetch = jest.fn()

// Wrap in an arrow so mockFetch is read at call time, not when node-fetch is
// first required.
jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockFetch(...args),
}))

import {
  AgentChannelProvider,
  DocumentType,
  EscalationNotificationChannel,
  EscalationSource,
  SEPARATOR,
  type Agent,
  type ChatConversationChannel,
  type EscalationContextDoc,
  type EscalationNotificationDoc,
} from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { replyToConversation, sendDiscordNotification } from "./discord"

// Escalation text is authored by the requester or quoted by the model from
// stored data, so it can carry @everyone/@here. Discord treats those as live
// mention tokens unless allowed_mentions says otherwise.
const HOSTILE_TITLE = "Expense approval @everyone"
const HOSTILE_SUMMARY = "Candy for @here"
const CHANNEL_ID = "111111111111111111"
const REQUESTER_ID = "222222222222222222"
const GUILD_ID = "333333333333333333"

const jsonResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({}),
  text: async () => "{}",
})

describe("discord escalation mentions", () => {
  const config = new TestConfiguration()
  let agent: Agent

  const postedBodies = () =>
    mockFetch.mock.calls.map(([, init]: [string, { body: string }]) =>
      JSON.parse(init.body)
    )

  const buildDocs = () => {
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
      title: HOSTILE_TITLE,
      summary: HOSTILE_SUMMARY,
    }
    const notifDoc: EscalationNotificationDoc = {
      _id: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}notif_1`,
      escalationId: "esc_1",
      appId,
      tenantId: config.getTenantId(),
      recipient: {
        type: EscalationNotificationChannel.DISCORD,
        config: { channelId: CHANNEL_ID },
      },
      sentAt: new Date().toISOString(),
    }
    return { contextDoc, notifDoc }
  }

  beforeEach(async () => {
    await config.newTenant()
    mockFetch.mockReset().mockResolvedValue(jsonResponse())
    agent = await config.api.agent.create({
      name: "Escalation Discord Agent",
      discordIntegration: {
        applicationId: "app-id",
        publicKey: "public-key",
        botToken: "discord-bot-token",
      },
    })
  })

  afterAll(() => {
    config.end()
  })

  it("does not let escalation content raise mentions", async () => {
    const { contextDoc, notifDoc } = buildDocs()

    await config.doInContext(config.getDevWorkspaceId(), () =>
      sendDiscordNotification({ notifDoc, contextDoc })
    )

    const [body] = postedBodies()
    // The text is posted as authored - it's the mention policy that defuses it.
    expect(body.content).toContain("@everyone")
    expect(body.allowed_mentions).toEqual({ parse: [] })
  })

  it("allows only the requester to be mentioned on a resume reply", async () => {
    const channel: ChatConversationChannel = {
      provider: AgentChannelProvider.DISCORD,
      channelId: CHANNEL_ID,
      guildId: GUILD_ID,
      externalUserId: REQUESTER_ID,
    }

    await config.doInContext(config.getDevWorkspaceId(), () =>
      replyToConversation({
        appId: config.getDevWorkspaceId(),
        agentId: agent._id,
        channel,
        text: "Approved. Notes: Fuel for @here",
      })
    )

    const [body] = postedBodies()
    // The deliberate requester mention must survive...
    expect(body.content).toContain(`<@${REQUESTER_ID}>`)
    // ...while anything the agent text carries stays inert.
    expect(body.allowed_mentions).toEqual({
      parse: [],
      users: [REQUESTER_ID],
    })
  })

  it("permits no mentions when replying without a requester (DM)", async () => {
    const channel: ChatConversationChannel = {
      provider: AgentChannelProvider.DISCORD,
      channelId: CHANNEL_ID,
    }

    await config.doInContext(config.getDevWorkspaceId(), () =>
      replyToConversation({
        appId: config.getDevWorkspaceId(),
        agentId: agent._id,
        channel,
        text: "Approved. Notes: Fuel for @here",
      })
    )

    const [body] = postedBodies()
    expect(body.allowed_mentions).toEqual({ parse: [] })
  })
})
