import TestConfiguration from "../TestConfiguration"
import { TestAPI, TestAPIOpts } from "./base"

export class RolesAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = (opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/roles`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }

  find = (appId: string, opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/roles/${appId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }

  remove = (appId: string, opts?: TestAPIOpts) => {
    return this.request
      .delete(`/api/global/roles/${appId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }
}
