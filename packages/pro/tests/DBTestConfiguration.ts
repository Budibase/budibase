import { context, db as dbCore } from "@budibase/backend-core"
import { structures, testEnv } from "@budibase/backend-core/tests"

class DBTestConfiguration {
  tenantId: string
  workspaceId: string

  constructor() {
    // db tests need to be multi tenant to prevent conflicts
    testEnv.multiTenant()
    this.tenantId = structures.tenant.id()
    this.workspaceId = dbCore.generateWorkspaceID(this.tenantId)
  }

  // TENANCY

  newTenant() {
    this.tenantId = structures.tenant.id()
    this.workspaceId = dbCore.generateWorkspaceID(this.tenantId)
  }

  doInTenant(task: any) {
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

  // WORKSPACES

  newWorkspace() {
    this.workspaceId = dbCore.generateWorkspaceID(this.tenantId)
    return this.workspaceId
  }

  doInWorkspace(task: any, workspaceId = this.workspaceId) {
    return this.doInTenant(() => {
      return context.doInWorkspaceContext(workspaceId, () => {
        return task()
      })
    })
  }
}

export default DBTestConfiguration
