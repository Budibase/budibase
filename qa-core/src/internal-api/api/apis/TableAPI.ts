import { Response } from "node-fetch"
import { Table } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { MessageResponse } from "../../../types"

export default class TableAPI {
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient) {
    this.client = client
  }

  async getAll(expectedNumber: Number): Promise<[Response, Table[]]> {
    const [response, json] = await this.client.get(`/tables`)
    expect(response).toHaveStatusCode(200)
    expect(json.length).toBe(expectedNumber)
    return [response, json]
  }

  async getTableById(id: string): Promise<[Response, Table]> {
    const [response, json] = await this.client.get(`/tables/${id}`)
    expect(response).toHaveStatusCode(200)
    expect(json._id).toEqual(id)
    return [response, json]
  }

  async save(body: any, columnAdded?: boolean): Promise<[Response, Table]> {
    const [response, json] = await this.client.post(`/tables`, { body })
    expect(response).toHaveStatusCode(200)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()
    if (columnAdded) {
      expect(json.schema.TestColumn).toBeDefined()
    }

    return [response, json]
  }

  async forbiddenSave(body: any): Promise<[Response, Table]> {
    const [response, json] = await this.client.post(`/tables`, { body })
    expect(response).toHaveStatusCode(403)

    return [response, json]
  }

  async delete(
    id: string,
    revId: string
  ): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.client.del(`/tables/${id}/${revId}`)
    expect(response).toHaveStatusCode(200)
    expect(json.message).toEqual(`Table ${id} deleted.`)
    return [response, json]
  }
}
