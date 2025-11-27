import TestConfiguration from "../TestConfiguration"
import { TestAPI, TestAPIOpts } from "./base"
import { LockRequest, ActivationRequest } from "@budibase/types"

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

  lock = (tenantId: string, body: LockRequest, opts?: TestAPIOpts) => {
    return this.request
      .put(`/api/system/tenants/${tenantId}/lock`)
      .send(body)
      .set(opts?.headers)
      .expect(opts?.status ? opts.status : 204)
  }

  activation = (
    tenantId: string,
    body: ActivationRequest,
    opts?: TestAPIOpts
  ) => {
    return this.request
      .put(`/api/system/tenants/${tenantId}/activation`)
      .send(body)
      .set(opts?.headers)
      .expect(opts?.status ? opts.status : 204)
  }
}
