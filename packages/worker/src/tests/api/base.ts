import { SuperTest, Test } from "supertest"
import TestConfiguration from "../TestConfiguration"

export interface TestAPIOpts {
  headers?: any
  status?: number
}

export abstract class TestAPI {
  config: TestConfiguration
  request: SuperTest<Test>

  protected constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }
}
