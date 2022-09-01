import TestConfiguration from "../TestConfiguration"
import { User } from "@budibase/types"

export class SelfAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  updateSelf = (user: User) => {
    return this.request
      .post(`/api/global/self`)
      .send(user)
      .set(this.config.authHeaders(user))
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
