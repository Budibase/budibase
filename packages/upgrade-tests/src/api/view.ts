import type { BudibaseClient } from "./BudibaseClient"

export class ViewAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(tableId: string) {
    const table = await this.client.table.get(tableId)
    return Object.values(table.views || {})
  }
}
