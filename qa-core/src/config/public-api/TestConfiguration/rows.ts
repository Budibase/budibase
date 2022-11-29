import PublicAPIClient from "./PublicAPIClient"
import {
  CreateRowParams,
  Row,
  SearchInputParams,
} from "@budibase/server/api/controllers/public/mapping/types"
import { HeadersInit, Response } from "node-fetch"
import { generateRow } from "../fixtures/tables"

export default class RowApi {
  api: PublicAPIClient
  headers?: HeadersInit
  tableId?: string

  constructor(apiClient: PublicAPIClient) {
    this.api = apiClient
  }

  async seed(tableId: string) {
    return this.create(generateRow({ tableId }))
  }

  async create(body: CreateRowParams): Promise<[Response, Row]> {
    const response = await this.api.post(`/tables/${this.tableId}/rows`, {
      body,
    })
    const json = await response.json()
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Row]> {
    const response = await this.api.get(`/tables/${this.tableId}/rows/${id}`)
    const json = await response.json()
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, [Row]]> {
    const response = await this.api.post(
      `/tables/${this.tableId}/rows/search`,
      { body }
    )
    const json = await response.json()
    return [response, json.data]
  }

  async update(id: string, body: Row): Promise<[Response, Row]> {
    const response = await this.api.put(`/tables/${this.tableId}/rows/${id}`, {
      body,
    })
    const json = await response.json()
    return [response, json.data]
  }
}
