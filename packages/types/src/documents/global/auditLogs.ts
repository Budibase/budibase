import { Document } from "../document"
import { Event } from "../../sdk"

export const AuditLogSystemUser = "SYSTEM"

export interface AuditLogDoc extends Document {
  appId?: string
  event: Event
  userId: string
  timestamp: string
  metadata: any
  name: string
}
