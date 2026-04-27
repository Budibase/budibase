import { context } from "@budibase/backend-core"
import {
  DocumentType,
  EscalationContextDoc,
  EscalationNotificationDoc,
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

const getDocId = (escalationId: string): string =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

export async function getContextDoc(
  escalationId: string
): Promise<EscalationContextDoc | undefined> {
  const db = context.getWorkspaceDB()
  return db.tryGet<EscalationContextDoc>(getDocId(escalationId))
}

export async function listContextDocs(): Promise<EscalationContextDoc[]> {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs<EscalationContextDoc>({
    startkey: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}`,
    endkey: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${UNICODE_MAX}`,
    include_docs: true,
  })
  return response.rows
    .map(row => row.doc)
    .filter((doc): doc is EscalationContextDoc => doc != null)
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
  const vm = new IsolatedVM()
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
