import { Response } from "node-fetch"
import { Table } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"


export default class TablesApi {
    api: InternalAPIClient

    constructor(apiClient: InternalAPIClient) {
        this.api = apiClient
    }

    async getTables(): Promise<[Response, Table[]]> {
        const response = await this.api.get(`/tables`)
        const json = await response.json()
        return [response, json]
    }

    async getTable(tableId: string): Promise<[Response, Table]> {
        const response = await this.api.get(`/tables/${tableId}`)
        const json = await response.json()
        return [response, json]
    }

    async createTable(body: any): Promise<[Response, Table]> {
        const response = await this.api.post(`/tables`, { body })
        const json = await response.json()
        return [response, json]
    }

    async deleteTable(tableId: string, revId: string): Promise<[Response, Table]> {
        const response = await this.api.del(`/tables/${tableId}/${revId}`)
        const json = await response.json()
        return [response, json]
    }

}