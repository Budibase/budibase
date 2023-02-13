import { Document } from "../document"
import { Event } from "../../sdk"

export interface AuditLogDocument extends Document {
  appId: string
  event: Event
  userId: string
  timestamp: string
  metadata: any
  name: string
}
