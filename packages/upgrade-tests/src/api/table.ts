import { Table } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class TableAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(appId?: string): Promise<Table[]> {
    const endpoint = appId
      ? `/api/applications/${appId}/tables`
      : `/api/tables`
    
    const response = await this.client.get(endpoint)
    return response.data
  }

  async get(tableId: string): Promise<Table> {
    const response = await this.client.get(`/api/tables/${tableId}`)
    return response.data
  }
}