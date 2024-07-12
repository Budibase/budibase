interface RowActionData {
  name: string
}
export interface CreateRowActionRequest extends RowActionData {}
export interface UpdateRowActionRequest extends RowActionData {}

export interface RowActionResponse extends RowActionData {
  id: string
  tableId: string
}

export interface RowActionsResponse {
  actions: Record<string, RowActionResponse>
}
