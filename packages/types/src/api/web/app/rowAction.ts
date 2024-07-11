export interface CreateRowActionRequest extends RowActionData {}

export interface RowActionResponse extends RowActionData {
  id: string
  tableId: string
}

export interface RowActionsResponse {
  tableId: string
  actions: Record<string, RowActionData>
}

interface RowActionData {
  name: string
}

export interface UpdateRowActionRequest extends RowActionData {}
