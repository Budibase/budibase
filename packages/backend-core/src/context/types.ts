import { IdentityContext, Snippet, VM } from "@budibase/types"

// keep this out of Budibase types, don't want to expose context info
export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
  environmentVariables?: Record<string, string>
  isScim?: boolean
  automationId?: string
  isMigrating?: boolean
  vm?: VM
  cleanup?: (() => void | Promise<void>)[]
  snippets?: Snippet[]
}
