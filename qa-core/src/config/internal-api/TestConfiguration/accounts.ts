import { Response } from "node-fetch"
import { Account } from "@budibase/types"
import InternalAPIClient from "./InternalAPIClient"

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

    async validateTenantId(tenantId: string): Promise<[Response, any]> {
        const response = await this.api.post(`/accounts/validate/tenantId`, { body: { tenantId } })
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        return [response, json]
    }

    async create(body: Account): Promise<[Response, Account]> {
        const response = await this.api.post(`/accounts`, { body })
        const json = await response.json()
        expect(response).toHaveStatusCode(200)
        return [response, json]
    }
}
