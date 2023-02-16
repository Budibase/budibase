import { Document } from "../document"

export interface Tenants extends Document {
  tenantIds: string[]
}
