import { IdentityContext } from "@budibase/types"

export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
}
