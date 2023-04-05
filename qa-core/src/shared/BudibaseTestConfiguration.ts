import { BudibaseInternalAPI } from "../internal-api"
import { AccountInternalAPI } from "../account-api"
import { CreateAppRequest, State } from "../types"
import * as fixtures from "../internal-api/fixtures"

// TEMP
import setup from "../jest/globalSetup"

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
    // TEMP - move back to single tenant when we integrate licensing with
    // the test run - need to use multiple tenants in cloud to get around
    // app limit restrictions
    await setup()

    // @ts-ignore
    this.state.tenantId = global.qa.tenantId
    // @ts-ignore
    this.state.cookie = global.qa.authCookie
  }

  async afterAll() {
    // nothing yet
  }

  async createApp(overrides: Partial<CreateAppRequest> = {}) {
    const app = await this.internalApi.apps.create(
      fixtures.apps.generateApp(overrides)
    )
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
    const [res, cookie] = await this.internalApi.auth.login(
      tenantId,
      email,
      password
    )
    this.state.cookie = cookie
  }
}
