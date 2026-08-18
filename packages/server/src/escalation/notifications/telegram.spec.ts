import nock from "nock"
import type { Agent } from "@budibase/types"
import { AgentChannelProvider } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { replyToConversation } from "./telegram"

const TELEGRAM_API_BASE = "https://api.telegram.org"
const BOT_TOKEN = "telegram-token"

describe("replyToConversation", () => {
  const config = new TestConfiguration()

  let agent: Agent
  let sentBodies: Record<string, any>[]

  const mockSendMessage = () => {
    sentBodies = []
    nock(TELEGRAM_API_BASE)
      .post(`/bot${BOT_TOKEN}/sendMessage`, body => {
        sentBodies.push(body)
        return true
      })
      .reply(200, { ok: true, result: {} })
  }

  beforeEach(async () => {
    await config.newTenant()
    nock.cleanAll()
    mockSendMessage()
    agent = await config.api.agent.create({
      name: "Telegram Agent",
      telegramIntegration: { botToken: BOT_TOKEN },
    })
  })

  afterAll(() => {
    nock.cleanAll()
    config.end()
  })

  it("includes message_thread_id when the conversation has a forum topic", async () => {
    await replyToConversation({
      appId: config.getDevWorkspaceId(),
      agentId: agent._id,
      channel: {
        provider: AgentChannelProvider.TELEGRAM,
        channelId: "-1001234",
        threadId: "42",
      },
      text: "Approved",
    })

    expect(sentBodies).toEqual([
      {
        chat_id: "-1001234",
        text: "Approved",
        message_thread_id: 42,
      },
    ])
  })

  it("omits message_thread_id when the conversation has no topic", async () => {
    await replyToConversation({
      appId: config.getDevWorkspaceId(),
      agentId: agent._id,
      channel: {
        provider: AgentChannelProvider.TELEGRAM,
        channelId: "-1001234",
      },
      text: "Approved",
    })

    expect(sentBodies).toEqual([
      {
        chat_id: "-1001234",
        text: "Approved",
      },
    ])
  })
})
