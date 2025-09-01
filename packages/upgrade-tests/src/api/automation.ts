import { Automation, FetchAutomationResponse } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class AutomationAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<Automation[]> {
    const { data } =
      await this.client.get<FetchAutomationResponse>("/api/automations")
    return data.automations
  }
}
