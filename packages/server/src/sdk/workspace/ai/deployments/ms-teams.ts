import archiver from "archiver"
import { HTTPError } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type Agent,
  type ResolvedMSTeamsIntegration,
} from "@budibase/types"
import * as shared from "./shared"

interface TeamsAppPackage {
  buffer: Buffer
  filename: string
}

interface TeamsAppManifestOptions {
  agent: Agent
  appId: string
  messagingEndpointUrl: string
}

interface TeamsAppPackageOptions extends TeamsAppManifestOptions {
  colorIcon: Buffer
  outlineIcon: Buffer
}

const MAX_SHORT_NAME_LENGTH = 30
const MAX_FULL_NAME_LENGTH = 100

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

const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }
  return value.slice(0, maxLength).trim()
}

const sanitizePackageName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "agent"

export const buildMSTeamsAppManifest = ({
  agent,
  appId,
  messagingEndpointUrl,
}: TeamsAppManifestOptions) => {
  const agentName = agent.name.trim()
  const description = agent.description?.trim() || agentName
  const endpointUrl = new URL(messagingEndpointUrl)

  return {
    $schema:
      "https://developer.microsoft.com/en-us/json-schemas/teams/v1.17/MicrosoftTeams.schema.json",
    manifestVersion: "1.17",
    version: "1.0.0",
    id: appId,
    packageName: `com.budibase.agent.${sanitizePackageName(agent._id || agentName)}`,
    developer: {
      name: "Budibase",
      websiteUrl: "https://budibase.com",
      privacyUrl: "https://budibase.com/privacy",
      termsOfUseUrl: "https://budibase.com/terms",
    },
    name: {
      short: truncate(agentName, MAX_SHORT_NAME_LENGTH),
      full: truncate(agentName, MAX_FULL_NAME_LENGTH),
    },
    description: {
      short: truncate(description, 80),
      full: truncate(description, 4000),
    },
    icons: {
      color: "color.png",
      outline: "outline.png",
    },
    accentColor: "#1E1E2F",
    bots: [
      {
        botId: appId,
        scopes: ["personal", "team", "groupchat"],
        supportsFiles: false,
        isNotificationOnly: false,
      },
    ],
    permissions: ["identity", "messageTeamMembers"],
    validDomains: [endpointUrl.hostname],
    configurableTabs: [],
    staticTabs: [],
    composeExtensions: [],
    showLoadingIndicator: false,
    isFullScreen: false,
  }
}

const createZip = (files: Record<string, Buffer | string>) =>
  new Promise<Buffer>((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } })
    const chunks: Uint8Array[] = []

    archive.on("data", chunk => chunks.push(new Uint8Array(chunk)))
    archive.on("error", reject)
    archive.on("end", () => resolve(Buffer.concat(chunks)))

    for (const [name, content] of Object.entries(files)) {
      archive.append(content, { name })
    }
    archive.finalize().catch(reject)
  })

export const buildMSTeamsAppPackage = async ({
  agent,
  appId,
  messagingEndpointUrl,
  colorIcon,
  outlineIcon,
}: TeamsAppPackageOptions): Promise<TeamsAppPackage> => {
  const manifest = buildMSTeamsAppManifest({
    agent,
    appId,
    messagingEndpointUrl,
  })
  const buffer = await createZip({
    "manifest.json": JSON.stringify(manifest, null, 2),
    "color.png": colorIcon,
    "outline.png": outlineIcon,
  })

  return {
    buffer,
    filename: `${sanitizePackageName(agent.name)}-teams-app.zip`,
  }
}
