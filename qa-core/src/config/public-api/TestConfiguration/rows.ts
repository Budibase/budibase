import PublicAPIClient from "./PublicAPIClient"
import {
  CreateRowParams,
  Row,
  SearchInputParams,
} from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import { HeadersInit, Response } from "node-fetch"

export default class RowApi {
  api: PublicAPIClient
  headers?: HeadersInit
  tableId?: string

  constructor(apiClient: PublicAPIClient) {
    this.api = apiClient
  }

  set appId(appId: string) {
    this.headers = {
      "x-budibase-app-id": appId,
    }
  }

  async create(body: CreateRowParams): Promise<[Response, Row]> {
    const response = await this.api.post(`/tables/${this.tableId}/rows`, {
      body,
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Row]> {
    const response = await this.api.get(`/tables/${this.tableId}/rows/${id}`, {
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, Row]> {
    const response = await this.api.post(
      `/tables/${this.tableId}/rows/search`,
      { body, headers: this.headers }
    )
    const json = await response.json()
    return [response, json.data]
  }

  async update(id: string, body: Row): Promise<[Response, Row]> {
    const response = await this.api.put(`/tables/${this.tableId}/rows/${id}`, {
      body,
      headers: this.headers,
    })
    const json = await response.json()
    return [response, json.data]
  }
}
