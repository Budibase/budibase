import { context } from "@budibase/backend-core"
import { Agent, EscalationContextDoc } from "@budibase/types"
import sdk from "../../sdk"

const DEFAULT_HEADING = "Escalation requires your review"

export class ProviderResponseError extends Error {
  constructor(
    readonly code: number,
    readonly body: string,
    provider: string
  ) {
    super(`${provider} ${code}: ${body}`)
  }
}

export const findIntegrationAgent = async (
  appId: string,
  agentId: string | undefined,
  has: (_agent: Agent) => boolean
): Promise<Agent | undefined> => {
  if (!agentId) {
    return undefined
  }
  return context.doInWorkspaceContext(appId, async () => {
    const agents = await sdk.ai.agents.fetch()
    return agents.find(a => a._id === agentId && has(a))
  })
}

// Resolves the human-facing heading + optional detail for a notification,
// falling back to a default heading when the trigger didn't supply one.
export const getEscalationText = (
  contextDoc: EscalationContextDoc
): { title: string; summary?: string } => ({
  title: contextDoc.title?.trim() || DEFAULT_HEADING,
  summary: contextDoc.summary?.trim() || undefined,
})
