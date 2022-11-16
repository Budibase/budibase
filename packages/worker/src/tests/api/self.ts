import TestConfiguration from "../TestConfiguration"
import { User } from "@budibase/types"
import { TestAPI } from "./base"

export class SelfAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  updateSelf = (user: User) => {
    return this.request
      .post(`/api/global/self`)
      .send(user)
      .set(this.config.authHeaders(user))
      .expect("Content-Type", /json/)
      .expect(200)
  }

  getSelf = (user: User) => {
    return this.request
      .get(`/api/global/self`)
      .set(this.config.authHeaders(user))
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
