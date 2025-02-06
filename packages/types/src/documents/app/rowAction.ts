import { Document } from "../document"

export interface TableRowActions extends Document {
  _id: string
  actions: Record<string, RowActionData>
}

export interface RowActionData {
  automationId: string
  permissions: RowActionPermissions
}

export interface RowActionPermissions {
  table: { runAllowed: boolean }
  views: Record<string, { runAllowed: boolean }>
}
