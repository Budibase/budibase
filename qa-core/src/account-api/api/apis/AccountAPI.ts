import { Response } from "node-fetch"
import {
  Account,
  CreateAccountRequest,
  SearchAccountsRequest,
  SearchAccountsResponse,
} from "@budibase/types"
import AccountInternalAPIClient from "../AccountInternalAPIClient"
import { APIRequestOpts } from "../../../types"
import { Header } from "@budibase/backend-core"
import BaseAPI from "./BaseAPI"

export default class AccountAPI extends BaseAPI {
  client: AccountInternalAPIClient

  constructor(client: AccountInternalAPIClient) {
    super()
    this.client = client
  }

  async validateEmail(email: string, opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.post(`/api/accounts/validate/email`, {
        body: { email },
      })
    }, opts)
  }

  async validateTenantId(
    tenantId: string,
    opts: APIRequestOpts = { status: 200 }
  ) {
    return this.doRequest(() => {
      return this.client.post(`/api/accounts/validate/tenantId`, {
        body: { tenantId },
      })
    }, opts)
  }

  async create(
    body: CreateAccountRequest,
    opts: APIRequestOpts & { autoVerify: boolean } = {
      status: 201,
      autoVerify: false,
    }
  ): Promise<[Response, Account]> {
    return this.doRequest(() => {
      const headers = {
        "no-verify": opts.autoVerify ? "1" : "0",
      }
      return this.client.post(`/api/accounts`, {
        body,
        headers,
      })
    }, opts)
  }

  async delete(accountID: string, opts: APIRequestOpts = { status: 204 }) {
    return this.doRequest(() => {
      return this.client.del(`/api/accounts/${accountID}`, {
        internal: true,
      })
    }, opts)
  }

  async deleteCurrentAccount(opts: APIRequestOpts = { status: 204 }) {
    return this.doRequest(() => {
      return this.client.del(`/api/accounts`)
    }, opts)
  }

  async verifyAccount(
    verificationCode: string,
    opts: APIRequestOpts = { status: 200 }
  ) {
    return this.doRequest(() => {
      return this.client.post(`/api/accounts/verify`, {
        body: { verificationCode },
      })
    }, opts)
  }

  async sendVerificationEmail(
    email: string,
    opts: APIRequestOpts = { status: 200 }
  ): Promise<[Response, string]> {
    return this.doRequest(async () => {
      const [response] = await this.client.post(`/api/accounts/verify/send`, {
        body: { email },
        headers: {
          [Header.RETURN_VERIFICATION_CODE]: "1",
        },
      })
      const code = response.headers.get(Header.VERIFICATION_CODE)
      return [response, code]
    }, opts)
  }

  async search(
    searchType: string,
    search: "email" | "tenantId",
    opts: APIRequestOpts = { status: 200 }
  ): Promise<[Response, SearchAccountsResponse]> {
    return this.doRequest(() => {
      let body: SearchAccountsRequest = {}
      if (search === "email") {
        body.email = searchType
      } else if (search === "tenantId") {
        body.tenantId = searchType
      }
      return this.client.post(`/api/accounts/search`, {
        body,
        internal: true,
      })
    }, opts)
  }

  async self(opts: APIRequestOpts = { status: 200 }) {
    return this.doRequest(() => {
      return this.client.get(`/api/auth/self`)
    }, opts)
  }
}
