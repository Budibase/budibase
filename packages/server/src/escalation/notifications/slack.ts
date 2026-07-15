import { WebClient } from "@slack/web-api"
import { createSlackAdapter } from "@chat-adapter/slack"
import { context, tenancy } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversationChannel,
  type EscalationContextDoc,
  type EscalationNotificationDoc,
  EscalationNotificationChannel,
} from "@budibase/types"
import sdk from "../../sdk"
import { getEscalationText } from "./utils"

const buildEscalationBlocks = ({
  title,
  summary,
  escalationId,
  notificationDocId,
  appId,
}: {
  title: string
  summary?: string
  escalationId: string
  notificationDocId: string
  appId: string
}) => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: summary ? `*${title}*\n${summary}` : `*${title}*`,
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "Approve" },
        style: "primary",
        action_id: "esc_approve",
        value: JSON.stringify({ escalationId, notificationDocId, appId }),
      },
      {
        type: "button",
        text: { type: "plain_text", text: "Reject" },
        style: "danger",
        action_id: "esc_reject",
        value: JSON.stringify({ escalationId, notificationDocId, appId }),
      },
    ],
  },
]

const getSlackIntegration = async (
  appId: string,
  agentId?: string
): Promise<
  { botToken: string; signingSecret: string; teamId?: string } | undefined
> => {
  return await context.doInWorkspaceContext(appId, async () => {
    const agents = await sdk.ai.agents.fetch()
    const agent = agentId
      ? agents.find(a => a._id === agentId && a.slackIntegration?.botToken)
      : agents.find(a => a.slackIntegration?.botToken)
    if (!agent?.slackIntegration?.botToken) {
      return undefined
    }
    const integration = sdk.ai.deployments.slack.validateSlackIntegration(agent)
    return {
      botToken: integration.botToken,
      signingSecret: integration.signingSecret,
      teamId: agent.slackIntegration.teamId,
    }
  })
}

export async function sendSlackNotification({
  notifDoc,
  contextDoc,
}: {
  notifDoc: EscalationNotificationDoc
  contextDoc: EscalationContextDoc
}): Promise<void> {
  if (notifDoc.recipient.type !== EscalationNotificationChannel.SLACK) {
    return
  }

  const config = notifDoc.recipient.config as Record<string, string>

  const integration = await getSlackIntegration(
    contextDoc.appId,
    contextDoc.agentId
  )
  if (!integration) {
    console.warn("sendSlackNotification: no Slack-enabled agent found", {
      escalationId: contextDoc._id,
      appId: contextDoc.appId,
    })
    return
  }

  const { title, summary } = getEscalationText(contextDoc)
  const blocks = buildEscalationBlocks({
    title,
    summary,
    escalationId: notifDoc.escalationId,
    notificationDocId: notifDoc._id!,
    appId: contextDoc.appId,
  })
  const client = new WebClient(integration.botToken)

  if (config.channelId) {
    await client.chat.postMessage({
      channel: config.channelId,
      text: title,
      blocks,
    })
    console.log("sendSlackNotification: message sent to channel", {
      escalationId: notifDoc.escalationId,
      channelId: config.channelId,
    })
    return
  }

  if (!config.globalUserId) {
    console.warn("sendSlackNotification: no recipient target in config", {
      escalationId: contextDoc._id,
    })
    return
  }

  let teamId = integration.teamId
  if (!teamId) {
    try {
      teamId = (await client.auth.test()).team_id
    } catch (err) {
      console.warn("sendSlackNotification: auth.test failed, unscoped lookup", {
        escalationId: contextDoc._id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const link = await tenancy.doInTenant(contextDoc.tenantId, () =>
    sdk.ai.chatIdentityLinks.getChatIdentityLinkByGlobalUserId({
      globalUserId: config.globalUserId,
      provider: AgentChannelProvider.SLACK,
      teamId,
    })
  )

  if (!link) {
    console.warn("sendSlackNotification: no Slack identity link for user", {
      globalUserId: config.globalUserId,
      escalationId: contextDoc._id,
    })
    return
  }

  await client.chat.postMessage({
    channel: link.externalUserId,
    text: title,
    blocks,
  })

  console.log("sendSlackNotification: message sent to user", {
    escalationId: notifDoc.escalationId,
    externalUserId: link.externalUserId,
  })
}

// Replies to the requester in their originating conversation on escalation
// resume - plain text in a DM, @mention in a real channel.
export async function replyToConversation({
  appId,
  agentId,
  channel,
  text,
}: {
  appId: string
  agentId?: string
  channel: ChatConversationChannel
  text: string
}): Promise<void> {
  if (!channel.channelId) {
    console.warn("replyToConversation: no channelId", { appId })
    return
  }
  const integration = await getSlackIntegration(appId, agentId)
  if (!integration) {
    console.warn("replyToConversation: no Slack-enabled agent", { appId })
    return
  }

  // SDK handles the namespaced thread id and markdown -> markdown_text formatting
  // Keeps formatting resolution consistent
  const adapter = createSlackAdapter({
    botToken: integration.botToken,
    signingSecret: integration.signingSecret,
  })
  const threadId = channel.threadId || channel.channelId
  // DM channels start with "D"; mention the requester in real channels.
  const isDm = channel.channelId.replace(/^slack:/, "").startsWith("D")
  const body =
    !isDm && channel.externalUserId
      ? `<@${channel.externalUserId}> ${text}`
      : text

  await adapter.postMessage(threadId, { markdown: body })
}
