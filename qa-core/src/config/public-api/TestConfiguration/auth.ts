import { Response } from "node-fetch"
import AccountsAPIClient from "./accountsAPIClient"
import { ApiKeyResponse } from "../fixtures/types/apiKeyResponse"

export default class AuthApi {
  api: AccountsAPIClient

  constructor(apiClient: AccountsAPIClient) {
    this.api = apiClient
  }

  async loginAsAdmin(): Promise<[Response, any]> {
    const response = await this.api.post(`/auth/login`, {
      body: {
        username: process.env.BB_ADMIN_USER_EMAIL,
        password: process.env.BB_ADMIN_USER_PASSWORD,
      },
    })
    const cookie = response.headers.get("set-cookie")
    this.api.cookie = cookie as any
    return [response, cookie]
  }

  async login(email: String, password: String): Promise<[Response, any]> {
    const response = await this.api.post(`/auth/login`, {
      body: {
        email: email,
        password: password,
      },
    })
    expect(response).toHaveStatusCode(200)
    const cookie = response.headers.get("set-cookie")
    this.api.cookie = cookie as any
    return [response, cookie]
  }

  async logout(): Promise<any> {
    return this.api.post(`/global/auth/logout`)
  }

  async getApiKey(): Promise<ApiKeyResponse> {
    const response = await this.api.get(`/global/self/api_key`)
    const json = await response.json()
    expect(response).toHaveStatusCode(200)
    expect(json).toHaveProperty("apiKey")
    return json
  }
}
