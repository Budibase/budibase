import { Datasource } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class DatasourceAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Datasource[]> {
    const { data } = await this.client.get<Datasource[]>("/api/datasources")
    return data
  }

  async get(datasourceId: string): Promise<Datasource> {
    const { data } = await this.client.get<Datasource>(
      `/api/datasources/${datasourceId}`
    )
    return data
  }
}
