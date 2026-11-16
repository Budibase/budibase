import { context } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type PlatformActionOrigin,
  type PlatformActionResourceOrigin,
  type PlatformActionUserOrigin,
} from "@budibase/types"

const CHAT_PROVIDER_LABELS: Record<AgentChannelProvider, string> = {
  [AgentChannelProvider.SLACK]: "Slack",
  [AgentChannelProvider.MSTEAMS]: "Microsoft Teams",
}

interface UserIdentity {
  _id?: string
  globalId?: string
  firstName?: string
  lastName?: string
  email?: string
}

export const getUserOrigin = ({
  _id,
  globalId,
  firstName,
  lastName,
  email,
}: UserIdentity): PlatformActionUserOrigin => {
  const name = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ")
  const label = name || email?.trim()
  const id = globalId || _id
  return {
    type: "user",
    ...(id ? { id } : {}),
    ...(label ? { label } : {}),
  }
}

// A chat sender not linked to a Budibase user has no user ID to record
export const getTransientChatUserOrigin = ({
  provider,
  displayName,
}: {
  provider: AgentChannelProvider
  displayName?: string
}): PlatformActionUserOrigin => {
  const name = displayName?.trim()
  const providerLabel = CHAT_PROVIDER_LABELS[provider]
  return {
    type: "user",
    label: name ? `${name} (${providerLabel})` : providerLabel,
  }
}

export const getAutomationOrigin = ({
  automationId,
  automationName,
}: {
  automationId?: string
  automationName?: string
}): PlatformActionResourceOrigin | undefined =>
  automationId && automationName
    ? { type: "automation", id: automationId, label: automationName }
    : undefined

export const doInAgentSessionScope = <T>({
  sessionId,
  agentId,
  agentName,
  triggeredBy,
  task,
}: {
  sessionId: string
  agentId: string
  // Absent when the agent couldn't be loaded, so no snapshot is recorded
  agentName?: string
  triggeredBy?: PlatformActionOrigin
  task: () => T
}) =>
  context.doInPlatformActionSessionContext(
    {
      sourceType: "agent_session",
      sourceId: sessionId,
      ...(agentName !== undefined
        ? { asset: { type: "agent", id: agentId, label: agentName } }
        : {}),
      triggeredBy,
    },
    task
  )
