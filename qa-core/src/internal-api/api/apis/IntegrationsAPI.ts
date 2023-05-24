import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class IntegrationsAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getAll(): Promise<[Response, any]> {
    const [response, json] = await this.get(`/integrations`)
    const integrationsCount = Object.keys(json).length
    expect(integrationsCount).toBeGreaterThan(0)
    return [response, json]
  }
}
