import { Response } from "node-fetch"
import { Account, CreateAccountRequest } from "@budibase/types"
import AccountInternalAPIClient from "../AccountInternalAPIClient"

export default class AccountAPI {

  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    this.client = client
  }

  async validateEmail(email: string): Promise<Response> {
    const [response, json] = await this.client.post(`/api/accounts/validate/email`, {
      body: { email },
    })
    expect(response).toHaveStatusCode(200)
    return response
  }

  async validateTenantId(tenantId: string): Promise<Response> {
    const [response, json] = await this.client.post(`/api/accounts/validate/tenantId`, {
      body: { tenantId },
    })
    expect(response).toHaveStatusCode(200)
    return response
  }

  async create(body: CreateAccountRequest): Promise<[Response, Account]> {
    const headers = {
      "no-verify": "1",
    }
    const [response, json] = await this.client.post(`/api/accounts`, { body, headers })
    expect(response).toHaveStatusCode(201)
    return [response, json]
  }
}
