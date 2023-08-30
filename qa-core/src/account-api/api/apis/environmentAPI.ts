import { Response } from "node-fetch"
import AccountInternalAPIClient from "../AccountInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class EnvironmentAPI extends BaseAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    super()
    this.client = client
  }

  async getEnvironment(opts: { status?: number } = {}): Promise<[Response]> {
    const [response, json] = await this.client.get(`/api/environment`)
    expect(response.status).toBe(opts.status ? opts.status : 200)
    return [response]
  }
}
