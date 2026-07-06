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
const SLACK_API_BASE = "https://slack.com/api"

export const SLACK_BOT_SCOPES = [
  "app_mentions:read",
  "channels:history",
  "chat:write",
  "commands",
  "im:history",
  "im:read",
  "im:write",
]

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
  oauthRedirectUrl,
}: {
  agent: Agent
  messagingEndpointUrl: string
  oauthRedirectUrl?: string
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
        always_online: true,
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
      ...(oauthRedirectUrl ? { redirect_urls: [oauthRedirectUrl] } : {}),
      scopes: {
        bot: SLACK_BOT_SCOPES,
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

interface SlackApiResponse {
  ok?: boolean
  error?: string
  errors?: { message?: string; pointer?: string }[]
}

interface SlackManifestCreateResponse extends SlackApiResponse {
  app_id?: string
  credentials?: {
    client_id?: string
    client_secret?: string
    signing_secret?: string
    verification_token?: string
  }
  oauth_authorize_url?: string
}

interface SlackOAuthAccessResponse extends SlackApiResponse {
  access_token?: string
  bot_user_id?: string
  app_id?: string
  team?: {
    id?: string
    name?: string
  }
}

const assertSlackOk = <T extends SlackApiResponse>(
  payload: T,
  action: string
) => {
  if (payload.ok) {
    return payload
  }
  const details = payload.errors?.map(error => error.message).filter(Boolean)
  const message = details?.length
    ? `${action}: ${details.join(", ")}`
    : `${action}: ${payload.error || "unknown_error"}`
  throw new HTTPError(message, 400)
}

export const createSlackAppFromManifest = async ({
  configToken,
  manifest,
}: {
  configToken: string
  manifest: ReturnType<typeof buildSlackManifest>
}) => {
  const response = await fetch(`${SLACK_API_BASE}/apps.manifest.create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${configToken}`,
    },
    body: JSON.stringify({
      manifest: JSON.stringify(manifest),
    }),
  })
  const payload = (await response.json()) as SlackManifestCreateResponse
  if (!response.ok) {
    throw new HTTPError("Failed to create Slack app", response.status)
  }
  return assertSlackOk(payload, "Failed to create Slack app")
}

export const exchangeSlackOAuthCode = async ({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}) => {
  const response = await fetch(`${SLACK_API_BASE}/oauth.v2.access`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  })
  const payload = (await response.json()) as SlackOAuthAccessResponse
  if (!response.ok) {
    throw new HTTPError("Failed to exchange Slack OAuth code", response.status)
  }
  return assertSlackOk(payload, "Failed to exchange Slack OAuth code")
}
