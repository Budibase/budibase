import crypto from "crypto"

import { HTTPError } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type Agent,
  type MSTeamsAppConfig,
  type ResolvedMSTeamsIntegration,
} from "@budibase/types"
import * as shared from "./shared"

const MAX_APP_NAME_LENGTH = 30
const MAX_SHORT_DESCRIPTION_LENGTH = 80
const MAX_FULL_DESCRIPTION_LENGTH = 4000
const DEFAULT_DESCRIPTION =
  "Ask this Budibase agent questions in Microsoft Teams."
const GRAPH_BASE = "https://graph.microsoft.com/v1.0"
const AZURE_MANAGEMENT_BASE = "https://management.azure.com"
const SERVICE_PRINCIPAL_RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 12000]

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

const secretFingerprint = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex").slice(0, 12)

const normaliseResourceName = (value: string) => {
  const safeName = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return truncate(safeName || "budibase-agent", 42)
}

const assertOk = async (response: Response, action: string) => {
  if (response.ok) {
    return
  }
  throw new HTTPError(`${action}: ${await response.text()}`, response.status)
}

const wait = async (delayMs: number) =>
  await new Promise(resolve => setTimeout(resolve, delayMs))

const isGraphConsistencyDelay = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false
  }
  return (
    error.message.includes("NoBackingApplicationObject") ||
    error.message.includes("does not reference a valid application object") ||
    error.message.includes("Request_ResourceNotFound") ||
    error.message.includes("does not exist") ||
    error.message.includes("queried reference-property objects are not present")
  )
}

interface MicrosoftTokenResponse {
  access_token?: string
}

interface MicrosoftApplicationResponse {
  id: string
  appId: string
}

interface MicrosoftPasswordResponse {
  secretText?: string
}

interface AzureBotServiceResponse {
  properties?: {
    msaAppId?: string
  }
}

interface AzureBotChannelResponse {
  properties?: {
    channelName?: string
    properties?: {
      isEnabled?: boolean
    }
  }
}

const getMicrosoftToken = async ({
  azureTenantId,
  clientId,
  clientSecret,
  scope,
}: {
  azureTenantId: string
  clientId: string
  clientSecret: string
  scope: string
}) => {
  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(
      azureTenantId
    )}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        scope,
      }),
    }
  )
  await assertOk(response, "Failed to acquire Microsoft access token")
  const payload = (await response.json()) as MicrosoftTokenResponse
  if (!payload.access_token) {
    throw new HTTPError("Microsoft token response was incomplete", 400)
  }
  return payload.access_token
}

const graphPost = async <T>(path: string, token: string, body: object) => {
  const response = await fetch(`${GRAPH_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  await assertOk(response, "Microsoft Graph request failed")
  return (await response.json()) as T
}

const graphPostWithConsistencyRetry = async <T>(
  path: string,
  token: string,
  body: object
) => {
  let lastError: unknown
  for (const delayMs of [0, ...SERVICE_PRINCIPAL_RETRY_DELAYS_MS]) {
    if (delayMs > 0) {
      await wait(delayMs)
    }

    try {
      return await graphPost<T>(path, token, body)
    } catch (error) {
      lastError = error
      if (!isGraphConsistencyDelay(error)) {
        throw error
      }
    }
  }
  throw lastError
}

const createServicePrincipal = async (token: string, appId: string) =>
  await graphPostWithConsistencyRetry<{ id: string }>(
    "/servicePrincipals",
    token,
    { appId }
  )

const azurePut = async ({
  path,
  token,
  body,
}: {
  path: string
  token: string
  body: object
}) => {
  const response = await fetch(`${AZURE_MANAGEMENT_BASE}${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  await assertOk(response, "Azure Bot Service request failed")
}

const azureGet = async <T>(path: string, token: string) => {
  const response = await fetch(`${AZURE_MANAGEMENT_BASE}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  await assertOk(response, "Azure Bot Service verification failed")
  return (await response.json()) as T
}

const verifyAzureResourceWithRetry = async (verify: () => Promise<void>) => {
  let lastError: unknown
  for (const delayMs of [0, ...SERVICE_PRINCIPAL_RETRY_DELAYS_MS]) {
    if (delayMs > 0) {
      await wait(delayMs)
    }

    try {
      await verify()
      return
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const verifyMSTeamsAppResources = async ({
  botName,
  resourcePath,
  token,
  appId,
}: {
  botName: string
  resourcePath: string
  token: string
  appId: string
}) => {
  await verifyAzureResourceWithRetry(async () => {
    const bot = await azureGet<AzureBotServiceResponse>(
      `${resourcePath}?api-version=2022-09-15`,
      token
    )
    if (bot.properties?.msaAppId !== appId) {
      throw new HTTPError(
        `Microsoft Teams bot registration could not be verified for ${botName}. Expected app ID ${appId}, got ${bot.properties?.msaAppId || "empty"}.`,
        400
      )
    }

    const channel = await azureGet<AzureBotChannelResponse>(
      `${resourcePath}/channels/MsTeamsChannel?api-version=2022-09-15`,
      token
    )
    if (
      channel.properties?.channelName !== "MsTeamsChannel" ||
      channel.properties?.properties?.isEnabled !== true
    ) {
      throw new HTTPError(
        "Microsoft Teams channel could not be verified as enabled.",
        400
      )
    }
  })
}

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

  console.log("Teams integration resolved", {
    appId,
    tenantId,
    appPasswordFingerprint: secretFingerprint(appPassword),
    appPasswordLooksMasked: appPassword === "********",
    appPasswordLooksEncoded: appPassword.startsWith("bbai_enc::"),
  })

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

export const createMSTeamsAppResources = async ({
  agent,
  config,
  messagingEndpointUrl,
}: {
  agent: Agent
  config: MSTeamsAppConfig
  messagingEndpointUrl: string
}) => {
  const graphToken = await getMicrosoftToken({
    azureTenantId: config.azureTenantId,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    scope: "https://graph.microsoft.com/.default",
  })
  const azureToken = await getMicrosoftToken({
    azureTenantId: config.azureTenantId,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    scope: "https://management.azure.com/.default",
  })

  const displayName = normaliseAppName(agent.name)
  const application = await graphPost<MicrosoftApplicationResponse>(
    "/applications",
    graphToken,
    {
      displayName,
      signInAudience: "AzureADMyOrg",
    }
  )

  await createServicePrincipal(graphToken, application.appId)

  const password =
    await graphPostWithConsistencyRetry<MicrosoftPasswordResponse>(
      `/applications/${application.id}/addPassword`,
      graphToken,
      {
        passwordCredential: {
          displayName: "Budibase Teams bot secret",
        },
      }
    )
  if (!password.secretText) {
    throw new HTTPError("Microsoft app secret response was incomplete", 400)
  }

  console.log("Teams app secret generated", {
    appId: application.appId,
    tenantId: config.azureTenantId,
    appPasswordFingerprint: secretFingerprint(password.secretText),
  })

  const botName = normaliseResourceName(`budibase-${application.appId}`)
  const resourcePath = `/subscriptions/${encodeURIComponent(
    config.subscriptionId
  )}/resourceGroups/${encodeURIComponent(
    config.resourceGroupName
  )}/providers/Microsoft.BotService/botServices/${encodeURIComponent(botName)}`

  await azurePut({
    path: `${resourcePath}?api-version=2022-09-15`,
    token: azureToken,
    body: {
      kind: "azurebot",
      location: config.location,
      sku: {
        name: "F0",
      },
      properties: {
        displayName,
        endpoint: messagingEndpointUrl,
        msaAppId: application.appId,
        msaAppTenantId: config.azureTenantId,
        msaAppType: "SingleTenant",
        tenantId: config.azureTenantId,
      },
    },
  })

  await azurePut({
    path: `${resourcePath}/channels/MsTeamsChannel?api-version=2022-09-15`,
    token: azureToken,
    body: {
      kind: "azurebot",
      location: config.location,
      sku: {
        name: "F0",
      },
      properties: {
        channelName: "MsTeamsChannel",
        properties: {
          acceptedTerms: true,
          isEnabled: true,
        },
      },
    },
  })

  await verifyMSTeamsAppResources({
    botName,
    resourcePath,
    token: azureToken,
    appId: application.appId,
  })

  return {
    appId: application.appId,
    appPassword: password.secretText,
    tenantId: config.azureTenantId,
  }
}
