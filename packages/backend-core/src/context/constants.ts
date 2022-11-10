import { IdentityContext } from "@budibase/types"

export enum ContextKey {
  MAIN = "main",
}

export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
}
