import { Query } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class QueryAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(appId?: string): Promise<Query[]> {
    const endpoint = appId
      ? `/api/applications/${appId}/queries`
      : `/api/queries`

    const response = await this.client.get(endpoint)
    return response.data
  }

  async execute(queryId: string, parameters?: any): Promise<any> {
    const response = await this.client.post(`/api/queries/${queryId}`, {
      parameters: parameters || {},
    })
    return response.data
  }
}
