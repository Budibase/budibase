import { BudibasePublicAPI } from "../api"
import { BudibaseTestConfiguration } from "../../shared"

export default class TestConfiguration<T> extends BudibaseTestConfiguration {
  // apis
  api: BudibasePublicAPI

  context: T

  constructor() {
    super()
    this.api = new BudibasePublicAPI(this.state)
    this.context = <T>{}
  }

  // LIFECYCLE

  async beforeAll() {
    await super.beforeAll()
    await this.setApiKey()
  }

  async afterAll() {
    await super.afterAll()
  }

  // AUTH

  async setApiKey() {
    const apiKeyResponse = await this.internalApi.self.getApiKey()
    this.state.apiKey = apiKeyResponse.apiKey
  }
}
