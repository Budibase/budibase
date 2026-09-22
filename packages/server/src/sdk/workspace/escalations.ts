import zlib from "zlib"
import { context, Duration, locks } from "@budibase/backend-core"
import type { UIMessage } from "ai"
import {
  DocumentType,
  LockName,
  LockType,
  EscalationAction,
  EscalationApproval,
  EscalationContextDoc,
  EscalationNotificationDoc,
  EscalationRecipient,
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
import { getFullUser } from "../../utilities/users"

const getDocId = (escalationId: string): string =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

const ESCALATION_LOCK_TTL_MS = Duration.fromSeconds(10).toMs()

// Serialises every writer to one escalation - responses, resolve, cancel and
// the resume job - so approvals land in arrival order and never race the
// resolution or resume writes.
export const withEscalationLock = async <T>(
  escalationId: string,
  task: () => Promise<T>
): Promise<T> => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.ESCALATION,
      resource: escalationId,
      type: LockType.DEFAULT,
      ttl: ESCALATION_LOCK_TTL_MS,
    },
    task
  )
  return result
}

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

// Human-readable label for a recipient. The channel's or the person's real
// name, never the provider (Slack/Teams/...). A globalUserId recipient is
// always a real Budibase user (the builder's recipient picker only offers
// users with an existing chat identity link), so the profile name is always
// resolvable
export async function resolveRecipientLabel(
  recipient: EscalationRecipient
): Promise<string> {
  const { config } = recipient
  if (config?.channelName) {
    return config.channelName
  }
  if (config?.channelId) {
    return config.channelId
  }
  if (config?.globalUserId) {
    try {
      const user = await getFullUser(config.globalUserId)
      return user.fullName || user.email || config.globalUserId
    } catch (error) {
      console.error("Failed to resolve escalation recipient's user", {
        globalUserId: config.globalUserId,
        error,
      })
      return config.globalUserId
    }
  }
  return "Unknown"
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
const appendResponse = async (
  notificationDocId: string,
  response: EscalationResponse
): Promise<"recorded" | "already_responded"> => {
  const db = context.getWorkspaceDB()
  const responderId = response.user?.userId
  const notifDoc = await db.tryGet<EscalationNotificationDoc>(notificationDocId)
  if (!notifDoc) {
    throw new Error(`Notification doc ${notificationDocId} not found`)
  }
  const existing = notifDoc.responses ?? []
  if (responderId && existing.some(r => r.user?.userId === responderId)) {
    return "already_responded"
  }
  await db.put({
    ...notifDoc,
    responses: [
      ...existing,
      { ...response, respondedAt: new Date().toISOString() },
    ],
  })
  return "recorded"
}

const appendApproval = async (
  escalationId: string,
  approval: EscalationApproval
): Promise<
  | { status: "recorded"; approvals: EscalationApproval[] }
  | { status: "already_responded" }
> => {
  const db = context.getWorkspaceDB()
  const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))
  if (!doc) {
    throw new Error(`Escalation ${escalationId} not found`)
  }
  const existing = doc.approvals ?? []
  if (existing.some(a => a.userId === approval.userId)) {
    return { status: "already_responded" }
  }
  const approvals = [...existing, approval]
  await db.put({ ...doc, approvals })
  return { status: "recorded", approvals }
}

export async function respond(
  escalationId: string,
  notificationDocId: string | undefined,
  response: EscalationResponse,
  resolve: (escalationId: string, response: EscalationResponse) => Promise<void>
): Promise<EscalationRespondResult> {
  return await withEscalationLock(escalationId, () =>
    respondUnderLock(escalationId, notificationDocId, response, resolve)
  )
}

const respondUnderLock = async (
  escalationId: string,
  notificationDocId: string | undefined,
  response: EscalationResponse,
  resolve: (escalationId: string, response: EscalationResponse) => Promise<void>
): Promise<EscalationRespondResult> => {
  const db = context.getWorkspaceDB()

  const contextDoc = await getContextDoc(escalationId)
  if (!contextDoc) {
    throw new Error(`Escalation ${escalationId} not found`)
  }
  if (contextDoc.resolution !== "pending") {
    return { status: "closed" }
  }

  if (notificationDocId) {
    const notifDoc =
      await db.tryGet<EscalationNotificationDoc>(notificationDocId)
    if (!notifDoc) {
      throw new Error(`Notification doc ${notificationDocId} not found`)
    }
    // Ensure the notification actually belongs to this escalation - stops a forged
    // payload pairing a valid notificationDocId with a different escalationId.
    if (notifDoc.escalationId !== escalationId) {
      console.warn(
        "Escalation respond: notification does not belong to escalation (possible forged payload)",
        {
          escalationId,
          notificationDocId,
          notifEscalationId: notifDoc.escalationId,
        }
      )
      throw new Error(
        `Notification ${notificationDocId} does not belong to escalation ${escalationId}`
      )
    }
    const appended = await appendResponse(notificationDocId, response)

    if (
      appended === "already_responded" &&
      !contextDoc.policy?.approvers?.length
    ) {
      return { status: "already_responded" }
    }
  }

  const approvers = contextDoc.policy?.approvers ?? []
  const totalRecipients = approvers.length || contextDoc.recipients?.length || 0
  let responses: EscalationResponse[]
  if (approvers.length) {
    const userId = response.userId
    if (typeof userId !== "string") {
      return { status: "unlinked" }
    }
    if (!approvers.includes(userId)) {
      return { status: "recorded" }
    }
    if (
      response.actionId !== EscalationAction.APPROVE &&
      response.actionId !== EscalationAction.REJECT
    ) {
      return { status: "recorded" }
    }
    const approved = await appendApproval(escalationId, {
      userId,
      actionId: response.actionId,
      respondedAt: new Date().toISOString(),
      ...(notificationDocId ? { notificationDocId } : {}),
    })
    if (approved.status === "already_responded") {
      return { status: "already_responded" }
    }
    responses = approved.approvals
  } else {
    const notifDocs = await listNotifications(escalationId)
    responses = notifDocs
      .flatMap(doc => doc.responses ?? [])
      .sort((a, b) => (a.respondedAt < b.respondedAt ? -1 : 1))
  }

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
  const actions = {
    approve: EscalationAction.APPROVE,
    reject: EscalationAction.REJECT,
  }
  const result = vm.withContext({ responses, totalRecipients, actions }, () =>
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
