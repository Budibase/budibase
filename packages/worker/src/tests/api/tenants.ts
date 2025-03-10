import type TestConfiguration from "../TestConfiguration"
import type { TestAPIOpts } from "./base"
import { TestAPI } from "./base"

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
}
