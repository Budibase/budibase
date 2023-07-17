export * as correlation from "./correlation/correlation"
export { logger } from "./pino/logger"
export * from "./alerts"
export * as system from "./system"

// turn off or on context logging i.e. tenantId, appId etc
export let LOG_CONTEXT = true
