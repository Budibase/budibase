import { Row } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class RowAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(tableId: string): Promise<Row[]> {
    const { data } = await this.client.get<Row[]>(`/api/${tableId}/rows`)
    return data
  }
}
