import { Screen } from "@budibase/types"
import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class ScreenAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async create(body: any): Promise<[Response, Screen]> {
    const [response, json] = await this.client.post(`/screens`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    expect(json.routing.roleId).toBe(body.routing.roleId)
    return [response, json]
  }

  async delete(screenId: string, rev: string): Promise<[Response, Screen]> {
    const [response, json] = await this.client.del(
      `/screens/${screenId}/${rev}`
    )
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }
}
