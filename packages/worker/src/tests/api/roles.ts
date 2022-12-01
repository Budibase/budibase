import TestConfiguration from "../TestConfiguration"
import { TestAPI, TestAPIOpts } from "./base"

export class RolesAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = (opts?: TestAPIOpts) => {
    return this.request
      .get(`/api/global/roles`)
      .set(opts?.headers ? opts.headers : this.config.defaultHeaders())
      .expect(opts?.status ? opts.status : 200)
  }
}
