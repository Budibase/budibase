import { Response } from "node-fetch"
import { Row } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"

export default class RowsApi {
    api: InternalAPIClient

    constructor(apiClient: InternalAPIClient) {
        this.api = apiClient
    }

    async getAll(id: string): Promise<[Response, Row[]]> {
        const response = await this.api.get(`/${id}/rows`)
        const json = await response.json()
        return [response, json]
    }
    async add(id: string, body: any): Promise<[Response, Row]> {
        const response = await this.api.post(`/${id}/rows`, { body })
        const json = await response.json()
        return [response, json]
    }

    async delete(id: string, body: any): Promise<[Response, Row[]]> {
        const response = await this.api.del(`/${id}/rows/`, { body })
        const json = await response.json()
        return [response, json]
    }
}
