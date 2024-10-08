import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class EnvironmentAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  getEnvironment = () => {
    return this.request
      .get(`/api/system/environment`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
