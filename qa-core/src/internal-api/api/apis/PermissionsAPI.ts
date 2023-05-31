import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class PermissionsAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getAll(id: string): Promise<[Response, any]> {
    const [response, json] = await this.get(`/permissions/${id}`)
    return [response, json]
  }
}
