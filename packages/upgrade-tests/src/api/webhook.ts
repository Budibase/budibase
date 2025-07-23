import { Webhook } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class WebhookAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Webhook[]> {
    const { data } = await this.client.get<Webhook[]>("/api/webhooks")
    return data
  }

  async get(webhookId: string): Promise<Webhook> {
    const { data } = await this.client.get<Webhook>(
      `/api/webhooks/${webhookId}`
    )
    return data
  }
}
