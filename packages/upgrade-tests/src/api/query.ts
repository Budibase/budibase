import { Query } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class QueryAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Query[]> {
    const { data } = await this.client.get<Query[]>("/api/queries")
    return data
  }

  async get(queryId: string): Promise<Query> {
    const { data } = await this.client.get<Query>(`/api/queries/${queryId}`)
    return data
  }
}
