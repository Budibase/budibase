import { Response } from "node-fetch"
import InternalAPIClient from "./InternalAPIClient"

export default class AuthApi {
  api: InternalAPIClient

  constructor(apiClient: InternalAPIClient) {
    this.api = apiClient
  }

  async login(): Promise<[Response, any]> {
    const response = await this.api.post(`/global/auth/default/login`, { 
      body: {
        // username: process.env.BB_ADMIN_USER_EMAIL,
        // password: process.env.BB_ADMIN_USER_PASSWORD
        username: "qa@budibase.com",
        password: "budibase"
      }
    })
    return [response, response.headers.get("set-cookie")]
  }
}
