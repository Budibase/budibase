import {
  CreateUserParams,
  SearchInputParams,
  User,
} from "@budibase/server/api/controllers/public/mapping/types"
import { Response } from "node-fetch"
import BudibasePublicAPIClient from "../BudibasePublicAPIClient"
import * as fixtures from "../../fixtures"

export default class UserAPI {
  client: BudibasePublicAPIClient

  constructor(client: BudibasePublicAPIClient) {
    this.client = client
  }

  async seed() {
    return this.create(fixtures.users.generateUser())
  }

  async create(body: CreateUserParams): Promise<[Response, User]> {
    const [response, json] = await this.client.post(`/users`, { body })
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, User]> {
    const [response, json] = await this.client.get(`/users/${id}`)
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, [User]]> {
    const [response, json] = await this.client.post(`/users/search`, { body })
    return [response, json.data]
  }

  async update(id: string, body: User): Promise<[Response, User]> {
    const [response, json] = await this.client.put(`/users/${id}`, { body })
    return [response, json.data]
  }
}
