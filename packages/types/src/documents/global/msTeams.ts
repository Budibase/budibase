import type { Document } from "../../"

export interface MSTeamsAppConfig extends Document {
  tenantId: string
  azureTenantId: string
  clientId: string
  clientSecret: string
  subscriptionId: string
  resourceGroupName: string
  location: string
  createdAt: string
  updatedAt: string
}
