import { Response } from "node-fetch"
import { Account } from "@budibase/types"
import AccountsAPIClient from "./accountsAPIClient"
import { NewAccount } from "../fixtures/types/newAccount"

export default class AccountsApi {
  api: AccountsAPIClient

  constructor(AccountsAPIClient: AccountsAPIClient) {
    this.api = AccountsAPIClient
  }

  async validateEmail(email: string): Promise<Response> {
    const response = await this.api.post(`/accounts/validate/email`, {
      body: { email },
    })
    expect(response).toHaveStatusCode(200)
    return response
  }

  async validateTenantId(tenantId: string): Promise<Response> {
    const response = await this.api.post(`/accounts/validate/tenantId`, {
      body: { tenantId },
    })
    expect(response).toHaveStatusCode(200)
    return response
  }

  async create(body: Partial<NewAccount>): Promise<[Response, Account]> {
    const headers = {
      "no-verify": "1",
    }
    const response = await this.api.post(`/accounts`, { body, headers })
    const json = await response.json()
    expect(response).toHaveStatusCode(201)
    return [response, json]
  }
}
