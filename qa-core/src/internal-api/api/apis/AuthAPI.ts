import { Response } from "node-fetch"
import BudibaseInternalAPIClient from "../BudibaseInternalAPIClient"
import { APIRequestOpts, State } from "../../../types"

export default class AuthAPI {
  state: State
  client: BudibaseInternalAPIClient

  constructor(client: BudibaseInternalAPIClient, state: State) {
    this.client = client
    this.state = state
  }

  async login(
    tenantId: string,
    email: string,
    password: string,
    opts: APIRequestOpts = { doExpect: true }
  ): Promise<[Response, string]> {
    const [response] = await this.client.post(
      `/global/auth/${tenantId}/login`,
      {
        body: {
          username: email,
          password: password,
        },
      }
    )
    if (opts.doExpect) {
      expect(response).toHaveStatusCode(200)
    }
    const cookie = response.headers.get("set-cookie")
    return [response, cookie!]
  }

  async logout(): Promise<any> {
    return this.client.post(`/global/auth/logout`)
  }
}
