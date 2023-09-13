import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class LegacyViewAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (id: string, { expectStatus } = { expectStatus: 200 }) => {
    return await this.request
      .get(`/api/views/${id}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }
}
