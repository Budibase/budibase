import { Response } from "node-fetch"
import AccountInternalAPIClient from "../AccountInternalAPIClient"
import { APIRequestOpts } from "../../../types"
import BaseAPI from "./BaseAPI"

export default class AuthAPI extends BaseAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    super()
    this.client = client
  }

  async login(
    email: string,
    password: string,
    opts: APIRequestOpts = { doExpect: true, status: 200 }
  ): Promise<[Response, string]> {
    return this.doRequest(async () => {
      const [res] = await this.client.post(`/api/auth/login`, {
        body: {
          email: email,
          password: password,
        },
      })
      const cookie = res.headers.get("set-cookie")
      return [res, cookie]
    }, opts)
  }

  async getSsoProvider(
      provider: string,
      opts: { status?: number } = {}
  ): Promise<[Response]> {
    const [response, json] = await this.client.get(
        `/api/auth/sso/${provider}`
    )
    expect(response.status).toBe(opts.status ? opts.status : 200)
    return [response]
  }

  async getSsoProviderCallback(
      provider: string,
      opts: { status?: number } = {}
  ): Promise<[Response]> {
    const [response, json] = await this.client.get(
        `/api/auth/sso/${provider}/callback`
    )
    expect(response.status).toBe(opts.status ? opts.status : 200)
    return [response]
  }
}
