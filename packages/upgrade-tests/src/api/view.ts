import { TableAPI } from "./table"
import type { BudibaseClient } from "./BudibaseClient"

export class ViewAPI {
  private tableAPI: TableAPI

  constructor(private client: BudibaseClient) {
    this.tableAPI = new TableAPI(client)
  }

  async fetch(tableId: string): Promise<any[]> {
    const table = await this.tableAPI.get(tableId)
    return Object.values(table.views || {})
  }
}