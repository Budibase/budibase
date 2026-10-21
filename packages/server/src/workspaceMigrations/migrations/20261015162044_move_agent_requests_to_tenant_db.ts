import { context, db as dbCore } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type { AgentRequest, EscalationContextDoc } from "@budibase/types"
import sdk from "../../sdk"

const OLD_PREFIX = `${DocumentType.AGENT_REQUEST}${SEPARATOR}`

const allOfType = async <T extends AgentRequest | EscalationContextDoc>(
  type: DocumentType
): Promise<T[]> => {
  const response = await context
    .getWorkspaceDB()
    .allDocs<T>(dbCore.getDocParams(type, null, { include_docs: true }))
  return response.rows.flatMap(row => (row.doc ? [row.doc] : []))
}

const relinkEscalations = async () => {
  const escalations = await allOfType<EscalationContextDoc>(
    DocumentType.ESCALATION_CONTEXT
  )
  const relinked = escalations
    .filter(doc => doc.requestId?.startsWith(OLD_PREFIX))
    .map(doc => ({
      ...doc,
      requestId: sdk.ai.agentRequests.toRequestId(doc.requestId!),
    }))
  if (!relinked.length) {
    return
  }
  const results = await context.getWorkspaceDB().bulkDocs(relinked)
  const failed = results.filter(result => result.error)
  if (failed.length) {
    throw new Error(
      `Failed to relink ${failed.length} of ${relinked.length} escalations: ${failed[0].error}`
    )
  }
}

// Requests are tracked for published workspaces only, so the prod DB is the
// source. The originals are left in place.
const migration = async () => {
  if (!dbCore.isProdWorkspaceID(context.getWorkspaceId())) {
    return
  }
  const requests = await allOfType<AgentRequest>(DocumentType.AGENT_REQUEST)
  for (const request of requests) {
    await sdk.ai.agentRequests.migrateLegacyRequest(request)
  }
  await relinkEscalations()
}

export default migration
