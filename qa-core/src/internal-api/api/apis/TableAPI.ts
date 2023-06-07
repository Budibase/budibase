import { Response } from "node-fetch"
import { Table } from "@budibase/types"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { MessageResponse } from "../../../types"
import BaseAPI from "./BaseAPI"

export default class TableAPI extends BaseAPI {
  constructor(client: BudibaseInternalAPIClient) {
    super(client)
  }

  async getAll(expectedNumber: Number): Promise<[Response, Table[]]> {
    const [response, json] = await this.get(`/tables`)
    expect(json.length).toBe(expectedNumber)
    return [response, json]
  }

  async getTableById(id: string): Promise<[Response, Table]> {
    const [response, json] = await this.get(`/tables/${id}`)
    expect(json._id).toEqual(id)
    return [response, json]
  }

  async save(body: any, columnAdded?: boolean): Promise<[Response, Table]> {
    const [response, json] = await this.post(`/tables`, body)
    expect(json._id).toBeDefined()
    expect(json._rev).toBeDefined()
    if (columnAdded) {
      expect(json.schema.TestColumn).toBeDefined()
    }

    return [response, json]
  }

  async forbiddenSave(body: any): Promise<[Response, Table]> {
    const [response, json] = await this.post(`/tables`, body, 403)
    return [response, json]
  }

  async delete(
    id: string,
    revId: string
  ): Promise<[Response, MessageResponse]> {
    const [response, json] = await this.del(`/tables/${id}/${revId}`)
    expect(json.message).toEqual(`Table ${id} deleted.`)
    return [response, json]
  }
}
