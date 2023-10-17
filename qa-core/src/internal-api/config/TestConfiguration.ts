import { BudibaseInternalAPI } from "../api"
import { BudibaseTestConfiguration } from "../../shared"

export default class TestConfiguration<T> extends BudibaseTestConfiguration {
  // apis
  api: BudibaseInternalAPI

  // context
  context: T

  constructor() {
    super()
    // for brevity
    this.api = this.internalApi
    this.context = <T>{}
  }

  async beforeAll() {
    await super.beforeAll()
  }

  async afterAll() {
    await super.afterAll()
  }
}
