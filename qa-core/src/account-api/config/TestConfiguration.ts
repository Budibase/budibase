import { AccountInternalAPI } from "../api"
import { BudibaseTestConfiguration } from "../../shared"

export default class TestConfiguration<T> extends BudibaseTestConfiguration {
  // apis
  api: AccountInternalAPI

  context: T

  constructor() {
    super()
    this.api = new AccountInternalAPI(this.state)
    this.context = <T>{}
  }

  async beforeAll() {
    await super.beforeAll()
    await this.setApiKey()
  }

  async afterAll() {
    await super.afterAll()
  }

  async setApiKey() {
    const apiKeyResponse = await this.internalApi.self.getApiKey()
    this.state.apiKey = apiKeyResponse.apiKey
  }
}
