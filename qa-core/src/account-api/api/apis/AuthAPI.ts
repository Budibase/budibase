import { Response } from "node-fetch"
import AccountInternalAPIClient from "../AccountInternalAPIClient"
import { APIRequestOpts } from "../../../types"

export default class AuthAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    this.client = client
  }

  async login(
    email: string,
    password: string,
    opts: APIRequestOpts = { doExpect: true }
  ): Promise<[Response, string]> {
    const [response, json] = await this.client.post(
      `/api/auth/login`,
      {
        body: {
          email: email,
          password: password,
        },
      }
    )
    // if (opts.doExpect) {
    //   expect(response).toHaveStatusCode(200)
    // }
    const cookie = response.headers.get("set-cookie")
    return [response, cookie!]
  }
}
