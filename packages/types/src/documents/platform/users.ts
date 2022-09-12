import { Document } from "../document"

/**
 * doc id is user email
 */
export interface PlatformUserByEmail extends Document {
  tenantId: string
  userId: string
}
