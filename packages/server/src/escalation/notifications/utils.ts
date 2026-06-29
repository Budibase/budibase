import { context } from "@budibase/backend-core"
import { Agent, EscalationContextDoc } from "@budibase/types"
import sdk from "../../sdk"

const DEFAULT_HEADING = "Escalation requires your review"

// Finds the agent providing a channel integration in the workspace - the one
// matching agentId, else the first with the integration. Each sender derives
// its token from the returned agent (Slack validates; others read directly).
export const findIntegrationAgent = (
  appId: string,
  agentId: string | undefined,
  has: (_agent: Agent) => boolean
): Promise<Agent | undefined> =>
  context.doInWorkspaceContext(appId, async () => {
    const agents = await sdk.ai.agents.fetch()
    return agentId
      ? agents.find(a => a._id === agentId && has(a))
      : agents.find(has)
  })

// Resolves the human-facing heading + optional detail for a notification,
// falling back to a default heading when the trigger didn't supply one.
export const getEscalationText = (
  contextDoc: EscalationContextDoc
): { title: string; summary?: string } => ({
  title: contextDoc.title?.trim() || DEFAULT_HEADING,
  summary: contextDoc.summary?.trim() || undefined,
})
