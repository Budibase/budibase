import { HTTPError } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type Agent,
  type ResolvedSlackIntegration,
} from "@budibase/types"
import * as shared from "./shared"

const MAX_APP_NAME_LENGTH = 35
const MAX_BOT_DISPLAY_NAME_LENGTH = 80
const MAX_DESCRIPTION_LENGTH = 140
const DEFAULT_DESCRIPTION = "Ask this Budibase agent questions in Slack."

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? value.slice(0, maxLength) : value

const normaliseDescription = (description?: string) =>
  truncate(description?.trim() || DEFAULT_DESCRIPTION, MAX_DESCRIPTION_LENGTH)

const normaliseAppName = (name: string) =>
  truncate(name.trim() || "Budibase Agent", MAX_APP_NAME_LENGTH)

const normaliseBotDisplayName = (name: string) => {
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return truncate(safeName || "budibase-agent", MAX_BOT_DISPLAY_NAME_LENGTH)
}

export const validateSlackIntegration = (
  agent: Agent
): ResolvedSlackIntegration => {
  const integration = agent.slackIntegration
  if (!integration) {
    throw new HTTPError(
      "Slack integration is not configured for this agent",
      400
    )
  }

  const botToken = integration.botToken?.trim()
  const signingSecret = integration.signingSecret?.trim()

  if (!botToken || !signingSecret) {
    throw new HTTPError(
      "Slack integration requires botToken and signingSecret",
      400
    )
  }

  return {
    botToken,
    signingSecret,
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) => await shared.resolveProviderChatAppForAgent(agentId, chatAppId)

export const buildSlackWebhookUrl = async (
  chatAppId: string,
  agentId: string
) =>
  await shared.buildProviderWebhookUrl(
    AgentChannelProvider.SLACK,
    chatAppId,
    agentId
  )

export const buildSlackManifest = ({
  agent,
  messagingEndpointUrl,
}: {
  agent: Agent
  messagingEndpointUrl: string
}) => {
  const name = normaliseAppName(agent.name)
  const description = normaliseDescription(agent.description || agent.goal)

  return {
    display_information: {
      name,
      description,
    },
    features: {
      app_home: {
        home_tab_enabled: false,
        messages_tab_enabled: true,
        messages_tab_read_only_enabled: false,
      },
      bot_user: {
        display_name: normaliseBotDisplayName(agent.name),
        always_online: false,
      },
      slash_commands: [
        {
          command: `/${ChatCommands.LINK}`,
          url: messagingEndpointUrl,
          description: "Link your Slack user to your Budibase account.",
          usage_hint: `/${ChatCommands.LINK}`,
          should_escape: false,
        },
      ],
    },
    oauth_config: {
      scopes: {
        bot: [
          "app_mentions:read",
          "channels:history",
          "chat:write",
          "commands",
          "im:history",
          "im:read",
          "im:write",
        ],
      },
    },
    settings: {
      event_subscriptions: {
        request_url: messagingEndpointUrl,
        bot_events: ["app_mention", "message.im"],
      },
      interactivity: {
        is_enabled: true,
        request_url: messagingEndpointUrl,
      },
      org_deploy_enabled: false,
      socket_mode_enabled: false,
      token_rotation_enabled: false,
    },
  }
}
