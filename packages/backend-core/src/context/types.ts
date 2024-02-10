import { IdentityContext, VM } from "@budibase/types"
import { ExecutionTimeTracker } from "../timers"

// keep this out of Budibase types, don't want to expose context info
export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
  environmentVariables?: Record<string, string>
  isScim?: boolean
  automationId?: string
  isMigrating?: boolean
  jsExecutionTracker?: ExecutionTimeTracker
  vm?: VM
}
