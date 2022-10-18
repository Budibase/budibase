import { Response } from "node-fetch"
import { Row, Table } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"
import { responseMessage } from "../fixtures/types/responseMessage"


export default class TablesApi {
    api: InternalAPIClient

    constructor(apiClient: InternalAPIClient) {
        this.api = apiClient
    }

    async getTables(expectedNumber: Number): Promise<[Response, Table[]]> {
        const response = await this.api.get(`/tables`)
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        expect(json.length).toBe(expectedNumber)
        return [response, json]
    }

    async getTableById(id: string): Promise<[Response, Table]> {
        const response = await this.api.get(`/tables/${id}`)
        const json = await response.json()
        return [response, json]
    }

    async create(body: any): Promise<[Response, Table]> {
        const response = await this.api.post(`/tables`, { body })
        const json = await response.json()
        return [response, json]
    }

    async deleteTable(id: string, revId: string): Promise<[Response, responseMessage]> {
        const response = await this.api.del(`/tables/${id}/${revId}`)
        const json = await response.json()
        return [response, json]
    }

    async update(body: any): Promise<[Response, Table]> {
        const response = await this.api.put(`/tables`, { body })
        const json = await response.json()
        return [response, json]
    }

    async getRows(id: string): Promise<[Response, Row[]]> {
        const response = await this.api.get(`/${id}/rows`)
        const json = await response.json()
        return [response, json]
    }
    async addRow(id: string, body: any): Promise<[Response, Row]> {
        const response = await this.api.post(`/${id}/rows`, { body })
        const json = await response.json()
        return [response, json]
    }

    async deleteRow(id: string, body: any): Promise<[Response, Row[]]> {
        const response = await this.api.del(`/${id}/rows/`, { body })
        const json = await response.json()
        return [response, json]
    }


}