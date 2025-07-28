import { FetchRowsResponse } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class RowAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(tableId: string): Promise<FetchRowsResponse> {
    const { data } = await this.client.get<FetchRowsResponse>(
      `/api/${tableId}/rows`
    )
    return data
  }
}
