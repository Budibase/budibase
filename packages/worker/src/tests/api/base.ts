import TestConfiguration from "../TestConfiguration"

export interface TestAPIOpts {
  headers?: any
  status?: number
}

export abstract class TestAPI {
  config: TestConfiguration
  request: any

  protected constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }
}
