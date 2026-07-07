import { HTTPError } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type Agent,
  type ResolvedMSTeamsIntegration,
} from "@budibase/types"
import * as shared from "./shared"

const MAX_APP_NAME_LENGTH = 30
const MAX_SHORT_DESCRIPTION_LENGTH = 80
const MAX_FULL_DESCRIPTION_LENGTH = 4000
const DEFAULT_DESCRIPTION =
  "Ask this Budibase agent questions in Microsoft Teams."

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? value.slice(0, maxLength) : value

const normaliseAppName = (name: string) =>
  truncate(name.trim() || "Budibase Agent", MAX_APP_NAME_LENGTH)

const normalisePackageSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "") || "agent"

const normaliseDescription = (description?: string) =>
  description?.trim() || DEFAULT_DESCRIPTION

const getOrigin = (url: string) => new URL(url).origin

const getHostname = (url: string) => new URL(url).hostname

export const validateMSTeamsIntegration = (
  agent: Agent
): ResolvedMSTeamsIntegration => {
  const integration = agent.MSTeamsIntegration
  if (!integration) {
    throw new HTTPError(
      "Teams integration is not configured for this agent",
      400
    )
  }

  const appId = integration.appId?.trim()
  const appPassword = integration.appPassword?.trim()
  const tenantId = integration.tenantId?.trim()

  if (!appId || !appPassword || !tenantId) {
    throw new HTTPError(
      "Teams integration requires appId (client ID) and appPassword (client secret value)",
      400
    )
  }

  return {
    appId,
    appPassword,
    tenantId,
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) => await shared.resolveProviderChatAppForAgent(agentId, chatAppId)

export const buildMSTeamsWebhookUrl = async (
  chatAppId: string,
  agentId: string
) =>
  await shared.buildProviderWebhookUrl(
    AgentChannelProvider.MSTEAMS,
    chatAppId,
    agentId
  )

export const buildMSTeamsManifest = ({
  agent,
  messagingEndpointUrl,
}: {
  agent: Agent
  messagingEndpointUrl: string
}) => {
  const integration = validateMSTeamsIntegration(agent)
  const name = normaliseAppName(agent.name)
  const description = normaliseDescription(agent.description || agent.goal)
  const origin = getOrigin(messagingEndpointUrl)

  return {
    $schema:
      "https://developer.microsoft.com/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
    manifestVersion: "1.16",
    version: "1.0.0",
    id: integration.appId,
    packageName: `com.budibase.agent.${normalisePackageSegment(
      agent._id || integration.appId
    )}`,
    developer: {
      name: "Budibase",
      websiteUrl: origin,
      privacyUrl: origin,
      termsOfUseUrl: origin,
    },
    name: {
      short: name,
      full: name,
    },
    description: {
      short: truncate(description, MAX_SHORT_DESCRIPTION_LENGTH),
      full: truncate(description, MAX_FULL_DESCRIPTION_LENGTH),
    },
    icons: {
      color: "color.png",
      outline: "outline.png",
    },
    accentColor: "#7052FF",
    bots: [
      {
        botId: integration.appId,
        scopes: ["personal", "team", "groupChat"],
        isNotificationOnly: false,
        supportsFiles: false,
        commandLists: [
          {
            scopes: ["personal", "team", "groupChat"],
            commands: [
              {
                title: ChatCommands.NEW,
                description: "Start a new Budibase agent conversation.",
              },
              {
                title: ChatCommands.LINK,
                description: "Link your Microsoft Teams user to Budibase.",
              },
            ],
          },
        ],
      },
    ],
    validDomains: [getHostname(messagingEndpointUrl)],
  }
}
