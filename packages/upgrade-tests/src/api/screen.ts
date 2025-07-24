import { FetchScreenResponse } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class ScreenAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<FetchScreenResponse> {
    const { data } = await this.client.get<FetchScreenResponse>("/api/screens")
    return data
  }
}
