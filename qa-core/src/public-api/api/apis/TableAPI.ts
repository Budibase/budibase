import {
  Table,
  SearchInputParams,
  CreateTableParams,
} from "@budibase/server/api/controllers/public/mapping/types"
import { HeadersInit, Response } from "node-fetch"
import { generateTable } from "../../fixtures/tables"
import BudibasePublicAPIClient from "../BudibasePublicAPIClient"

export default class TableAPI {
  headers?: HeadersInit

  client: BudibasePublicAPIClient

  constructor(client: BudibasePublicAPIClient) {
    this.client = client
  }

  async seed() {
    return this.create(generateTable())
  }

  async create(body: CreateTableParams): Promise<[Response, Table]> {
    const [response, json] = await this.client.post(`/tables`, {
      body,
    })
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Table]> {
    const [response, json] = await this.client.get(`/tables/${id}`)
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, [Table]]> {
    const [response, json] = await this.client.post(`/tables/search`, { body })
    return [response, json.data]
  }

  async update(id: string, body: Table): Promise<[Response, Table]> {
    const [response, json] = await this.client.put(`/tables/${id}`, { body })
    return [response, json.data]
  }
}
