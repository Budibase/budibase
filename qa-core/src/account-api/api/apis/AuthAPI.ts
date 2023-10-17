import { Response } from "node-fetch"
import AccountInternalAPIClient from "../AccountInternalAPIClient"
import { APIRequestOpts } from "../../../types"
import BaseAPI from "./BaseAPI"
import { Header } from "@budibase/backend-core"

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

  async logout(opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.post(`/api/auth/logout`)
    }, opts)
  }

  async resetPassword(
    email: string,
    opts: APIRequestOpts = { status: 200 }
  ): Promise<[Response, string]> {
    return this.doRequest(async () => {
      const [response] = await this.client.post(`/api/auth/reset`, {
        body: { email },
        headers: {
          [Header.RETURN_RESET_PASSWORD_CODE]: "1",
        },
      })
      const code = response.headers.get(Header.RESET_PASSWORD_CODE)
      return [response, code]
    }, opts)
  }

  async resetPasswordUpdate(
    resetCode: string,
    password: string,
    opts: APIRequestOpts = { status: 200 }
  ) {
    return this.doRequest(() => {
      return this.client.post(`/api/auth/reset/update`, {
        body: {
          resetCode: resetCode,
          password: password,
        },
      })
    }, opts)
  }
}
