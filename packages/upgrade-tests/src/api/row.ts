import { Row } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class RowAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(tableId: string, limit = 1000): Promise<Row[]> {
    const response = await this.client.get(`/api/${tableId}/rows`, {
      query: { limit: limit.toString() },
    })
    return response.data
  }

  async search(tableId: string, query: any): Promise<{ rows: Row[] }> {
    const response = await this.client.post(`/api/${tableId}/search`, query)
    return response.data
  }
}
