import AccountInternalAPIClient from "./AccountInternalAPIClient"
import { AccountAPI, LicenseAPI, AuthAPI, StripeAPI } from "./apis"
import { State } from "../../types"

export default class AccountInternalAPI {
  client: AccountInternalAPIClient

  auth: AuthAPI
  accounts: AccountAPI
  licenses: LicenseAPI
  stripe: StripeAPI

  constructor(state: State) {
    this.client = new AccountInternalAPIClient(state)
    this.auth = new AuthAPI(this.client)
    this.accounts = new AccountAPI(this.client)
    this.licenses = new LicenseAPI(this.client)
    this.stripe = new StripeAPI(this.client)
  }
}
