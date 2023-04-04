import { BudibaseInternalAPI } from "../internal-api"
import { AccountInternalAPI } from "../account-api"
import { CreateAppRequest, State } from "../types"
import { DEFAULT_TENANT_ID } from "@budibase/backend-core"

import * as fixtures from "../internal-api/fixtures"

export default class BudibaseTestConfiguration {

  // apis
  internalApi: BudibaseInternalAPI
  accountsApi: AccountInternalAPI

  // state
  state: State

  constructor() {
    this.state = {}
    this.internalApi = new BudibaseInternalAPI(this.state)
    this.accountsApi = new AccountInternalAPI(this.state)
  }

  // LIFECYCLE

  async beforeAll() {
    // const env = await this.internalApi.environment.getEnvironment()
    //
    // if (env.multiTenancy) {
    //   const account = await this.createAccount()
    //   this.state.tenantId = account.tenantId
    //   await this.login(account.email, account.password)
    //   BudibaseTestConfiguration.ACCOUNT_TENANT_ID = account.tenantId
    // } else {
    //   this.state.tenantId = DEFAULT_TENANT_ID
    //   await this.loginAsAdmin()
    // }
  }

  async afterAll() {
    await this.internalApi.auth.logout()
  }

  async createApp(overrides: Partial<CreateAppRequest> = {}) {
    const app = await this.internalApi.apps.create(fixtures.apps.generateApp(overrides))
    this.state.appId = app.appId
    return app
  }

  // AUTH

  async login(email: string, password: string, tenantId?: string) {
    if (!tenantId && this.state.tenantId) {
      tenantId = this.state.tenantId
    } else {
      throw new Error("Could not determine tenant id")
    }
    const [res, cookie] = await this.internalApi.auth.login(tenantId, email, password)
    this.state.cookie = cookie
  }

}