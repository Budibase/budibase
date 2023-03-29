import TestConfiguration from "../TestConfiguration"
import { TestAPI, TestAPIOpts } from "./base"

export class TenantAPI extends TestAPI {
  config: TestConfiguration
  constructor(config: TestConfiguration) {
    super(config)
    this.config = config
  }

  delete = (tenantId: string, opts?: TestAPIOpts) => {
    return this.request
      .delete(`/api/system/tenants/${tenantId}`)
      .set(opts?.headers)
      .expect(opts?.status ? opts.status : 204)
  }

  info = (tenantId: string) => {
    return this.request
      .get(`/api/system/tenants/${tenantId}/info`)
      .set(this.config.defaultHeaders())
      .expect(200)
  }
}
