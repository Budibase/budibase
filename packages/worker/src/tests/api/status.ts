import { TestAPI } from "./base"

export class StatusAPI extends TestAPI {
  getStatus = () => {
    return this.request.get(`/api/system/status`).expect(200)
  }
}
