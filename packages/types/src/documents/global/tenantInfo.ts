import { Hosting } from "../../sdk"
import { Document } from "../document"

export interface TenantInfo extends Document {
  owner: {
    email: string
    password?: string
    ssoId?: string
    givenName?: string
    familyName?: string
    budibaseUserId?: string
  }
  tenantId: string
  hosting: Hosting
}
