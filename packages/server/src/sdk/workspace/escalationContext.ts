import { context } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type { EscalationContextDoc } from "@budibase/types"

export const getDocId = (escalationId: string): string =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

// A copy of another workspace's escalation (e.g. from an old export) keeps the
// original's appId - acting on it would resume or cancel the original
export async function getContextDoc(
  escalationId: string
): Promise<EscalationContextDoc | undefined> {
  const db = context.getWorkspaceDB()
  const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))
  return doc?.appId === context.getWorkspaceId() ? doc : undefined
}
