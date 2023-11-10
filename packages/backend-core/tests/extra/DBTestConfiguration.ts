import "../core/utilities/mocks"
import * as structures from "../core/utilities/structures"
import * as testEnv from "./testEnv"
import * as context from "../../src/context"

class DBTestConfiguration {
  tenantId: string

  constructor() {
    // db tests need to be multi tenant to prevent conflicts
    testEnv.multiTenant()
    this.tenantId = structures.tenant.id()
  }

  newTenant() {
    this.tenantId = structures.tenant.id()
  }

  // TENANCY

  doInTenant<T>(task: () => Promise<T>) {
    return context.doInTenant(this.tenantId, () => {
      return task()
    })
  }

  getTenantId() {
    try {
      return context.getTenantId()
    } catch (e) {
      return this.tenantId!
    }
  }
}

export default DBTestConfiguration
