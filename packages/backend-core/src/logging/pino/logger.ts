import env from "../../environment"
import pino, { LoggerOptions } from "pino"
import * as context from "../../context"
import * as correlation from "../correlation"

// LOGGER

const pinoOptions: LoggerOptions = {
  level: env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: () => {
      return { };
    },
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
}

if (env.isDev()) {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      singleLine: true
    },
    // ignore: "responseTime"
  }
}

export const logger = pino(pinoOptions)

// CONSOLE OVERRIDES

function getCtx() {
  const identity = getIdentity()
  return {
    ctx: {
      tenantId: getTenantId(),
      appId: getAppId(),
      identityId: identity?._id,
      identityType: identity?.type,
      correlationId: correlation.getId()
    }
  }
}

console.log = (data) => { logger.info(getCtx(), data) }
console.info = (data) => { logger.info(getCtx(), data) }
console.warn = (data) => { logger.warn(getCtx(), data) }
console.error = (data) => { logger.error(getCtx(), data) }
console.trace = (data) => { logger.trace(getCtx(), data) }
console.debug = (data) => { logger.debug(getCtx(), data) }

// CONTEXT

const getTenantId = () => {
  let tenantId
  try {
    tenantId = context.getTenantId()
  } catch (e: any) {
    // do nothing
  }
  return tenantId
}

const getAppId = () => {
  let appId
  try {
    appId = context.getAppId()
  } catch (e) {
    // do nothing
  }
  return appId
}

const getIdentity = () => {
  let identity
  try {
    identity = context.getIdentity()
  } catch (e) {
    // do nothing
  }
  return identity
}

export default logger