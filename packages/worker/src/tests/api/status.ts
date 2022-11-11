import TestConfiguration from "../TestConfiguration"

export class StatusAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  getStatus = () => {
    return this.request.get(`/api/system/status`).expect(200)
  }
}
