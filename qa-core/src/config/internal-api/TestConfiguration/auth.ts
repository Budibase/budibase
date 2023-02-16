import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"

export default class AuthApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async loginAsAdmin(): Promise<[Response, any]> {
    const response = await this.api.post(`/global/auth/default/login`, {
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
    const response = await this.api.post(`/global/auth/default/login`, {
      body: {
        username: email,
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
}
