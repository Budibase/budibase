import { Expectations, TestAPI } from "./base"
import {
  SaveWebhookResponse,
  TriggerWebhookResponse,
  Webhook,
} from "@budibase/types"

export class WebhookAPI extends TestAPI {
  save = async (webhook: Webhook, expectations?: Expectations) => {
    const resp = await this._post<SaveWebhookResponse>("/api/webhooks", {
      body: webhook,
      expectations: {
        status: 200,
        ...expectations,
      },
    })
    return resp.webhook
  }

  trigger = async (
    appId: string,
    webhookId: string,
    fields: Record<string, any>,
    expectations?: Expectations
  ) => {
    const resp = await this._post<TriggerWebhookResponse>(
      `/api/webhooks/trigger/${appId}/${webhookId}`,
      {
        body: fields,
        expectations: {
          status: 200,
          ...expectations,
        },
      }
    )
    return resp?.message
  }
}
