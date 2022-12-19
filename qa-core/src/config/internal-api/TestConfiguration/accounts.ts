import { Response } from "node-fetch"
import { Table } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"
import { responseMessage } from "../fixtures/types/responseMessage"

export default class AccountsApi {
    api: InternalAPIClient

    constructor(apiClient: InternalAPIClient) {
        this.api = apiClient
    }

    async validateEmail(email: string): Promise<[Response, any]> {
        const response = await this.api.post(`/accounts/validate/email`, { body: { email } })
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        return [response, json]
    }
}
