import TestConfiguration from "../TestConfiguration"
import { User } from "@budibase/types"
import { TestAPI } from "./base"

export class SelfAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  updateSelf = (user: User, update: any) => {
    return this.request
      .post(`/api/global/self`)
      .send(update)
      .set(this.config.authHeaders(user))
      .expect("Content-Type", /json/)
  }

  getSelf = (user: User) => {
    return this.request
      .get(`/api/global/self`)
      .set(this.config.authHeaders(user))
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
