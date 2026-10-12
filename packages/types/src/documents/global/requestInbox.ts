import { Document } from "../document"
import type { AgentRequestStatus } from "./agentRequests"

export const REQUEST_INBOX_TYPE = "requestInbox"

export const REQUEST_ESCALATION_STATES = [
  "pending",
  "approved",
  "rejected",
  "expired",
  "cancelled",
] as const

export type RequestEscalationState = (typeof REQUEST_ESCALATION_STATES)[number]

export interface RequestInboxDoc extends Document {
  _id: string
  type: typeof REQUEST_INBOX_TYPE
  globalUserId: string
  workspaceId: string
  requestId: string
  title?: string
  agentId: string
  operationId?: string
  status: AgentRequestStatus
  needsInput: boolean
  isRequester: boolean
  isApprover: boolean
  awaitingResponse: boolean
  respondedPending: boolean
  expiresAt?: string
}
