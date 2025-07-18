import { Table } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class TableAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Table[]> {
    const { data } = await this.client.get<Table[]>("/api/tables")
    return data
  }

  async get(tableId: string): Promise<Table> {
    const { data } = await this.client.get<Table>(`/api/tables/${tableId}`)
    return data
  }
}
