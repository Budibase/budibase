import {
  CreateRowParams,
  Row,
  SearchInputParams,
} from "@budibase/server/api/controllers/public/mapping/types"
import { HeadersInit, Response } from "node-fetch"
import BudibasePublicAPIClient from "../BudibasePublicAPIClient"
import * as fixtures from "../../fixtures"
import { State } from "../../../types"

export default class RowAPI {
  client: BudibasePublicAPIClient

  headers?: HeadersInit

  state: State

  constructor(client: BudibasePublicAPIClient, state: State) {
    this.state = state
    this.client = client
  }

  async seed(tableId: string) {
    return this.create(fixtures.rows.generateRow({ tableId }))
  }

  async create(body: CreateRowParams): Promise<[Response, Row]> {
    const [response, json] = await this.client.post(
      `/tables/${this.state.tableId}/rows`,
      {
        body,
      }
    )
    return [response, json.data]
  }

  async read(id: string): Promise<[Response, Row]> {
    const [response, json] = await this.client.get(
      `/tables/${this.state.tableId}/rows/${id}`
    )
    return [response, json.data]
  }

  async search(body: SearchInputParams): Promise<[Response, [Row]]> {
    const [response, json] = await this.client.post(
      `/tables/${this.state.tableId}/rows/search`,
      { body }
    )
    return [response, json.data]
  }

  async update(id: string, body: Row): Promise<[Response, Row]> {
    const [response, json] = await this.client.put(
      `/tables/${this.state.tableId}/rows/${id}`,
      {
        body,
      }
    )
    return [response, json.data]
  }
}
