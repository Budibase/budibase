import TestConfiguration from "../TestConfiguration"

export class EnvironmentAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  getEnvironment = () => {
    return this.request
      .get(`/api/system/environment`)
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
