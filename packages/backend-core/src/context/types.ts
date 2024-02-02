import { IdentityContext } from "@budibase/types"
import { Isolate, Context, Module } from "isolated-vm"

// keep this out of Budibase types, don't want to expose context info
export type ContextMap = {
  tenantId?: string
  appId?: string
  identity?: IdentityContext
  environmentVariables?: Record<string, string>
  isScim?: boolean
  automationId?: string
  isMigrating?: boolean
  isolateRefs?: {
    jsIsolate: Isolate
    jsContext: Context
    helpersModule: Module
  }
  cleanup?: (() => void | Promise<void>)[]
}
