import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class IntegrationsAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getAll(): Promise<[Response, any]> {
    const [response, json] = await this.client.get(`/integrations`)
    expect(response).toHaveStatusCode(200)
    const integrationsCount = Object.keys(json).length
    expect(integrationsCount).toBe(16)
    return [response, json]
  }
}
