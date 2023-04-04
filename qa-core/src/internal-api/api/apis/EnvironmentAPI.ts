import { GetEnvironmentResponse } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class EnvironmentAPI {

  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }
  
  async getEnvironment(): Promise<GetEnvironmentResponse> {
    const [response, json] = await this.client.get(`/system/environment`)
    expect(response.status).toBe(200)
    return json
  }
}
