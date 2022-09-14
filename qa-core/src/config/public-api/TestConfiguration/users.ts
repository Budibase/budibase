import PublicAPIClient from "./PublicAPIClient"
import {
  CreateUserParams,
  SearchInputParams,
  User,
} from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import { Response } from "node-fetch"

export default class UserApi {
  api: PublicAPIClient

  constructor(apiClient: PublicAPIClient) {
    this.api = apiClient
  }

  async seed() {}

  async create(body: CreateUserParams): Promise<[Response, User]> {
    const response = await this.api.post(`/users`, { body })
    const json = await response.json()
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, User]> {
    const response = await this.api.get(`/users/${id}`)
    const json = await response.json()
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, User]> {
    const response = await this.api.post(`/users/search`, { body })
    const json = await response.json()
    return [response, json.data]
  }

  async update(id: string, body: User): Promise<[Response, User]> {
    const response = await this.api.put(`/users/${id}`, { body })
    const json = await response.json()
    return [response, json.data]
  }
}
