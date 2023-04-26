import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class PermissionsAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getAll(id: string): Promise<[Response, any]> {
    const [response, json] = await this.client.get(`/permissions/${id}`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }
}
