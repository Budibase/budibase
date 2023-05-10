import { Screen } from "@budibase/types"
import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class ScreenAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async create(body: any): Promise<[Response, Screen]> {
    const [response, json] = await this.post(`/screens`, body)
    expect(json._id).toBeDefined()
    expect(json.routing.roleId).toBe(body.routing.roleId)
    return [response, json]
  }

  async delete(screenId: string, rev: string): Promise<[Response, Screen]> {
    const [response, json] = await this.del(`/screens/${screenId}/${rev}`)
    return [response, json]
  }
}
