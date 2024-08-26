import { Document } from "../document"

export interface TableRowActions extends Document {
  _id: string
  actions: Record<
    string,
    {
      name: string
      automationId: string
      permissions: {
        table: { runAllowed: boolean }
        views: Record<string, { runAllowed: boolean }>
      }
    }
  >
}
