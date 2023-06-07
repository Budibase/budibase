import AccountInternalAPIClient from "./AccountInternalAPIClient"
import { AccountAPI, LicenseAPI } from "./apis"
import { State } from "../../types"

export default class AccountInternalAPI {
  client: AccountInternalAPIClient

  accounts: AccountAPI
  licenses: LicenseAPI

  constructor(state: State) {
    this.client = new AccountInternalAPIClient(state)
    this.accounts = new AccountAPI(this.client)
    this.licenses = new LicenseAPI(this.client)
  }
}
