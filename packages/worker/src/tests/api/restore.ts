import { TestAPI, TestAPIOpts } from "./base"

export class RestoreAPI extends TestAPI {
  restored = (opts?: TestAPIOpts) => {
    return this.request
      .post(`/api/system/restored`)
      .set(this.config.tenantIdHeaders())
      .expect(opts?.status ? opts.status : 200)
  }
}
