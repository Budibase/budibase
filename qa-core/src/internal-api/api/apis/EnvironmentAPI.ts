import { GetEnvironmentResponse } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { APIRequestOpts } from "../../../types"

export default class EnvironmentAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getEnvironment(
    opts: APIRequestOpts = { doExpect: true }
  ): Promise<GetEnvironmentResponse> {
    const [response, json] = await this.client.get(`/system/environment`)
    if (opts.doExpect) {
      expect(response.status).toBe(200)
    }
    return json
  }
}
