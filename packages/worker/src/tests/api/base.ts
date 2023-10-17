import TestConfiguration from "../TestConfiguration"
import { SuperTest, Test } from "supertest"

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
