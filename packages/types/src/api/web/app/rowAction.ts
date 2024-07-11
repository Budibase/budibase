export interface CreateRowActionRequest {
  name: string
}

export interface RowActionsResponse {
  tableId: string
  actions: {
    id: string
    name: string
  }[]
}
