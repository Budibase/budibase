import { BudibaseInternalAPI } from "../internal-api"
import { AccountInternalAPI } from "../account-api"
import { APIRequestOpts, CreateAppRequest, State } from "../types"
import * as fixtures from "../internal-api/fixtures"
import { CreateAccountRequest } from "@budibase/types"

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
    // @ts-ignore
    this.state.tenantId = global.qa.tenantId
    // @ts-ignore
    this.state.email = global.qa.email
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

  async doInNewState(task: () => Promise<any>) {
    return this.doWithState(task, {})
  }

  async doWithState(task: () => Promise<any>, state: State) {
    const original = { ...this.state }

    // override the state
    this.state.apiKey = state.apiKey
    this.state.appId = state.appId
    this.state.cookie = state.cookie
    this.state.tableId = state.tableId
    this.state.tenantId = state.tenantId
    this.state.email = state.email

    await task()

    // restore the state
    this.state.apiKey = original.apiKey
    this.state.appId = original.appId
    this.state.cookie = original.cookie
    this.state.tableId = original.tableId
    this.state.tenantId = original.tenantId
    this.state.email = original.email
  }

  async loginAsAccount(
    account: CreateAccountRequest,
    opts: APIRequestOpts = {}
  ) {
    const [_, cookie] = await this.accountsApi.auth.login(
      account.email,
      account.password,
      opts
    )
    this.state.cookie = cookie
  }

  async login(email: string, password: string, tenantId?: string) {
    if (!tenantId && this.state.tenantId) {
      tenantId = this.state.tenantId
    }
    if (!tenantId) {
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
