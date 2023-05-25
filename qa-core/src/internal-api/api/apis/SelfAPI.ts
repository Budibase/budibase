import { Response } from "node-fetch"
import { User } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { ApiKeyResponse } from "../../../types"
import BaseAPI from "./BaseAPI"

export default class SelfAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getSelf(): Promise<[Response, Partial<User>]> {
    const [response, json] = await this.get(`/global/self`)
    return [response, json]
  }

  async changeSelfPassword(body: Partial<User>): Promise<[Response, User]> {
    const [response, json] = await this.post(`/global/self`, body)
    expect(json._id).toEqual(body._id)
    expect(json._rev).not.toEqual(body._rev)
    return [response, json]
  }

  async getApiKey(): Promise<ApiKeyResponse> {
    const [response, json] = await this.get(`/global/self/api_key`)
    expect(json).toHaveProperty("apiKey")
    return json
  }
}
