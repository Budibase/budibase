import { Response } from "node-fetch"
import { Role, UserRoles } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"

export default class RoleAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getRoles(): Promise<[Response, Role[]]> {
    const [response, json] = await this.client.get(`/roles`)
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }

  async createRole(body: Partial<UserRoles>): Promise<[Response, UserRoles]> {
    const [response, json] = await this.client.post(`/roles`, { body })
    expect(response).toHaveStatusCode(200)
    return [response, json]
  }
}
