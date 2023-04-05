import { Response } from "node-fetch"
import { User } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { ApiKeyResponse } from "../../../types"

export default class SelfAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getSelf(): Promise<[Response, Partial<User>]> {
    const [response, json] = await this.client.get(`/global/self`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async changeSelfPassword(body: Partial<User>): Promise<[Response, User]> {
    const [response, json] = await this.client.post(`/global/self`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(body._id)
    expect(json._rev).not.toEqual(body._rev)
    return [response, json]
  }

  async getApiKey(): Promise<ApiKeyResponse> {
    const [response, json] = await this.client.get(`/global/self/api_key`)
    expect(response).toHaveStatusCode(200)
    expect(json).toHaveProperty("apiKey")
    return json
  }
}
