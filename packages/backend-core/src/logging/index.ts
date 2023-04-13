export * as correlation from "./correlation/correlation"
export { default as logger } from "./pino/logger"
export * from "./alerts"

// turn off or on context logging i.e. tenantId, appId etc
export let LOG_CONTEXT = true
