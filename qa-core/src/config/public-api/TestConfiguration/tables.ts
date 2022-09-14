import PublicAPIClient from "./PublicAPIClient"
import {
  Table,
  SearchInputParams,
  CreateTableParams,
} from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import { HeadersInit, Response } from "node-fetch"
import { generateTable } from "../fixtures/tables"

export default class TableApi {
  api: PublicAPIClient
  headers?: HeadersInit

  constructor(apiClient: PublicAPIClient) {
    this.api = apiClient
  }

  async seed() {
    return this.create(generateTable())
  }

  set appId(appId: string) {
    this.headers = {
      "x-budibase-app-id": appId,
    }
  }

  async create(body: CreateTableParams): Promise<[Response, Table]> {
    const response = await this.api.post(`/tables`, {
      body,
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Table]> {
    const response = await this.api.get(`/tables/${id}`, {
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, Table]> {
    const response = await this.api.post(`/tables/search`, {
      body,
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }

  async update(id: string, body: Table): Promise<[Response, Table]> {
    const response = await this.api.put(`/tables/${id}`, {
      body,
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }
}
