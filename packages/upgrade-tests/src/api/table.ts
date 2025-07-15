import { Table } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class TableAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Table[]> {
    const response = await this.client.get("/api/tables")
    return response.data
  }

  async get(tableId: string): Promise<Table> {
    const response = await this.client.get(`/api/tables/${tableId}`)
    return response.data
  }
}
