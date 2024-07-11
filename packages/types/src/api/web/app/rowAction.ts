export interface CreateRowActionRequest extends RowActionData {}

export interface RowActionResponse extends RowActionData {
  tableId: string
  actionId: string
}

export interface RowActionsResponse {
  tableId: string
  actions: Record<string, RowActionData>
}

interface RowActionData {
  name: string
}
