import { IdentityContext } from "@budibase/types"
import { Isolate, Context } from "isolated-vm"

// keep this out of Budibase types, don't want to expose context info
export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
  environmentVariables?: Record<string, string>
  isScim?: boolean
  automationId?: string
  isMigrating?: boolean
  jsIsolate: Isolate
  jsContext: Context
}
