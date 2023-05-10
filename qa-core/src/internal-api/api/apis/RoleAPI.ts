import { Response } from "node-fetch"
import { Role, UserRoles } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import BaseAPI from "./BaseAPI"

export default class RoleAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getRoles(): Promise<[Response, Role[]]> {
    const [response, json] = await this.get(`/roles`)
    return [response, json]
  }

  async createRole(body: Partial<UserRoles>): Promise<[Response, UserRoles]> {
    const [response, json] = await this.post(`/roles`, body)
    return [response, json]
  }
}
