import {
  configs,
  context,
  db as dbCore,
  HTTPError,
} from "@budibase/backend-core"
import { AgentChannelProvider } from "@budibase/types"

/** Webhook URL path segment (ms-teams uses hyphen, provider value uses msteams) */
export const WEBHOOK_PATH_BY_PROVIDER: Record<AgentChannelProvider, string> = {
  [AgentChannelProvider.MSTEAMS]: "ms-teams",
  [AgentChannelProvider.SLACK]: "slack",
}

export const buildWebhookUrl = async ({
  provider,
  agentId,
  useProdWorkspaceId = false,
}: {
  provider: AgentChannelProvider
  agentId: string
  useProdWorkspaceId?: boolean
}) => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }
  const targetWorkspaceId = useProdWorkspaceId
    ? dbCore.getProdWorkspaceID(workspaceId)
    : workspaceId
  const pathSegment = WEBHOOK_PATH_BY_PROVIDER[provider]
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/${pathSegment}/${targetWorkspaceId}/${agentId}`
}

export const buildProviderWebhookUrl = async (
  provider: AgentChannelProvider,
  agentId: string
) =>
  await buildWebhookUrl({
    provider,
    agentId,
    useProdWorkspaceId: true,
  })
