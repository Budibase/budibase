import { TestAPI } from "./base"

export class EnvironmentAPI extends TestAPI {
  getEnvironment = () => {
    return this.request
      .get(`/api/system/environment`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
