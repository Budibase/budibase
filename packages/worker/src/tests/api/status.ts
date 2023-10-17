import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class StatusAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  getStatus = () => {
    return this.request.get(`/api/system/status`).expect(200)
  }
}
