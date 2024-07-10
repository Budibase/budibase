export interface CreateRowActionRequest {
  name: string
}

interface RowAction {
  name: string
}

export interface RowActionsResponse {
  tableId: string
  actions: RowAction[]
}
