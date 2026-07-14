import zlib from "zlib"
import { context } from "@budibase/backend-core"
import type { UIMessage } from "ai"
import {
  DocumentType,
  EscalationContextDoc,
  EscalationNotificationDoc,
  EscalationResult,
  EscalationRespondResult,
  EscalationResponse,
  isEscalationResponse,
  SEPARATOR,
  UNICODE_MAX,
} from "@budibase/types"
import {
  decodeJSBinding,
  iifeWrapper,
  isJSBinding,
} from "@budibase/string-templates"
import { IsolatedVM } from "../../jsRunner/vm"
import { RESOLUTION_STRATEGY_SNIPPETS } from "../../escalation/resolutionStrategies"

const getDocId = (escalationId: string): string =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

export async function getContextDoc(
  escalationId: string
): Promise<EscalationContextDoc | undefined> {
  const db = context.getWorkspaceDB()
  return db.tryGet<EscalationContextDoc>(getDocId(escalationId))
}

// Lean poll payload for the originating chat - inflates the resumed assistant
// message server-side so the browser doesn't have to. Undefined if the
// escalation doesn't exist.
export async function getResult(
  escalationId: string
): Promise<EscalationResult | undefined> {
  const doc = await getContextDoc(escalationId)
  if (!doc) {
    return undefined
  }
  let resumeResult: UIMessage | undefined
  if (doc.resumeResultCompressed) {
    resumeResult = JSON.parse(
      zlib
        .inflateSync(
          Uint8Array.from(Buffer.from(doc.resumeResultCompressed, "base64"))
        )
        .toString()
    )
  }
  return {
    resolution: doc.resolution,
    title: doc.title,
    summary: doc.summary,
    resumeResult,
  }
}

export interface EscalationContextQuery {
  agentId?: string
  operationId?: string
  sessionId?: string
  requestId?: string
  resolution?: EscalationContextDoc["resolution"]
  isTest?: boolean
}

// Filters context docs server-side on the top-level qualifiers so callers only
// pull what they need rather than the whole escalation_context range.
export async function listContextDocs(
  query: EscalationContextQuery = {}
): Promise<EscalationContextDoc[]> {
  const db = context.getWorkspaceDB()
  const response = await db.find<EscalationContextDoc>({
    selector: {
      _id: {
        $gte: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}`,
        $lt: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${UNICODE_MAX}`,
      },
      ...(query.agentId ? { agentId: query.agentId } : {}),
      ...(query.operationId ? { operationId: query.operationId } : {}),
      ...(query.sessionId ? { sessionId: query.sessionId } : {}),
      ...(query.requestId ? { requestId: query.requestId } : {}),
      ...(query.resolution ? { resolution: query.resolution } : {}),
      ...(query.isTest !== undefined ? { isTest: query.isTest } : {}),
    },
  })
  return response.docs
}

export async function listContextDocsBySession(
  sessionId: string
): Promise<EscalationContextDoc[]> {
  return listContextDocs({ sessionId })
}

export async function listNotifications(
  escalationId: string
): Promise<EscalationNotificationDoc[]> {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<EscalationNotificationDoc>({
    startkey: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}`,
    endkey: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}${UNICODE_MAX}`,
    include_docs: true,
  })
  return response.rows
    .map(row => row.doc)
    .filter(
      (doc): doc is EscalationNotificationDoc =>
        doc != null && doc.escalationId === escalationId
    )
}

// Handles an incoming response from a recipient - writes the notification doc,
// runs the resolution strategy, and triggers resolve if the strategy returns truthy.
// NOTE: as notification channels grow, a dedicated notification processor may be
// a better home for this responsibility than the escalation processor.
export async function respond(
  escalationId: string,
  notificationDocId: string,
  response: EscalationResponse,
  resolve: (escalationId: string, response: EscalationResponse) => Promise<void>
): Promise<EscalationRespondResult> {
  const db = context.getWorkspaceDB()

  const contextDoc = await getContextDoc(escalationId)
  if (!contextDoc) {
    throw new Error(`Escalation ${escalationId} not found`)
  }
  if (contextDoc.resolution !== "pending") {
    return { status: "closed" }
  }

  const notifDoc = await db.tryGet<EscalationNotificationDoc>(notificationDocId)
  if (!notifDoc) {
    throw new Error(`Notification doc ${notificationDocId} not found`)
  }
  await db.put({
    ...notifDoc,
    response,
    respondedAt: new Date().toISOString(),
  })

  const notifDocs = await listNotifications(escalationId)
  const totalRecipients = contextDoc.recipients?.length ?? 0
  const responses = notifDocs
    .filter(doc => doc.respondedAt)
    .map(doc => doc.response)

  console.log("Escalation respond: responses so far", {
    escalationId,
    responded: responses.length,
    total: totalRecipients,
    responses,
  })

  if (!contextDoc.resolutionStrategy) {
    return { status: "recorded" }
  }

  const rawCode = isJSBinding(contextDoc.resolutionStrategy)
    ? decodeJSBinding(contextDoc.resolutionStrategy!)!
    : contextDoc.resolutionStrategy!
  const vm = new IsolatedVM().withSnippets(RESOLUTION_STRATEGY_SNIPPETS)
  const result = vm.withContext({ responses, totalRecipients }, () =>
    vm.execute(iifeWrapper(rawCode))
  )

  console.log("Escalation resolution strategy result", {
    result,
    type: typeof result,
  })

  if (isEscalationResponse(result)) {
    await resolve(escalationId, result)
  }

  return { status: "recorded" }
}
