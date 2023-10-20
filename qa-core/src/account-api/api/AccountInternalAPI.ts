import AccountInternalAPIClient from "./AccountInternalAPIClient"
import { AccountAPI, LicenseAPI, AuthAPI } from "./apis"
import { State } from "../../types"

export default class AccountInternalAPI {
  client: AccountInternalAPIClient

  auth: AuthAPI
  accounts: AccountAPI
  licenses: LicenseAPI

  constructor(state: State) {
    this.client = new AccountInternalAPIClient(state)
    this.auth = new AuthAPI(this.client)
    this.accounts = new AccountAPI(this.client)
    this.licenses = new LicenseAPI(this.client)
  }
}
