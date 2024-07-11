export interface CreateRowActionRequest {
  name: string
}

export interface RowActionsResponse {
  tableId: string
  actions: {
    name: string
  }[]
}
