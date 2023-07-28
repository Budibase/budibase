import pino, { LoggerOptions } from "pino"
import pinoPretty from "pino-pretty"

import { IdentityType } from "@budibase/types"
import env from "../../environment"
import * as context from "../../context"
import * as correlation from "../correlation"

import { localFileDestination } from "../system"

// LOGGER

let pinoInstance: pino.Logger | undefined
if (!env.DISABLE_PINO_LOGGER) {
  const level = env.LOG_LEVEL
  const pinoOptions: LoggerOptions = {
    level,
    formatters: {
      level: level => {
        return { level: level.toUpperCase() }
      },
      bindings: () => {
        if (env.SELF_HOSTED) {
          // "service" is being injected in datadog using the pod names,
          // so we should leave it blank to allow the default behaviour if it's not running self-hosted
          return {
            service: env.SERVICE_NAME,
          }
        } else {
          return {}
        }
      },
    },
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
  }

  const destinations: pino.StreamEntry[] = []

  destinations.push(
    env.isDev()
      ? {
          stream: pinoPretty({ singleLine: true }),
          level: level as pino.Level,
        }
      : { stream: process.stdout, level: level as pino.Level }
  )

  if (env.SELF_HOSTED) {
    destinations.push({
      stream: localFileDestination(),
      level: level as pino.Level,
    })
  }

  pinoInstance = destinations.length
    ? pino(pinoOptions, pino.multistream(destinations))
    : pino(pinoOptions)

  // CONSOLE OVERRIDES

  interface MergingObject {
    objects?: any[]
    tenantId?: string
    appId?: string
    automationId?: string
    identityId?: string
    identityType?: IdentityType
    correlationId?: string
    err?: Error
  }

  function isPlainObject(obj: any) {
    return typeof obj === "object" && obj !== null && !(obj instanceof Error)
  }

  function isError(obj: any) {
    return obj instanceof Error
  }

  function isMessage(obj: any) {
    return typeof obj === "string"
  }

  /**
   * Backwards compatibility between console logging statements
   * and pino logging requirements.
   */
  function getLogParams(args: any[]): [MergingObject, string] {
    let error = undefined
    let objects: any[] = []
    let message = ""

    args.forEach(arg => {
      if (isMessage(arg)) {
        message = `${message} ${arg}`.trimStart()
      }
      if (isPlainObject(arg)) {
        objects.push(arg)
      }
      if (isError(arg)) {
        error = arg
      }
    })

    const identity = getIdentity()

    let contextObject = {}

    contextObject = {
      tenantId: getTenantId(),
      appId: getAppId(),
      automationId: getAutomationId(),
      identityId: identity?._id,
      identityType: identity?.type,
      correlationId: correlation.getId(),
    }

    const mergingObject: any = {
      err: error,
      pid: process.pid,
      ...contextObject,
    }

    if (objects.length) {
      // init generic data object for params supplied that don't have a
      // '_logKey' field. This prints an object using argument index as the key
      // e.g. { 0: {}, 1: {} }
      const data: any = {}
      let dataIndex = 0

      for (let i = 0; i < objects.length; i++) {
        const object = objects[i]
        // the object has specified a log key
        // use this instead of generic key
        const logKey = object._logKey
        if (logKey) {
          delete object._logKey
          mergingObject[logKey] = object
        } else {
          data[dataIndex] = object
          dataIndex++
        }
      }

      if (Object.keys(data).length) {
        mergingObject.data = data
      }
    }

    return [mergingObject, message]
  }

  console.log = (...arg: any[]) => {
    const [obj, msg] = getLogParams(arg)
    pinoInstance?.info(obj, msg)
  }
  console.info = (...arg: any[]) => {
    const [obj, msg] = getLogParams(arg)
    pinoInstance?.info(obj, msg)
  }
  console.warn = (...arg: any[]) => {
    const [obj, msg] = getLogParams(arg)
    pinoInstance?.warn(obj, msg)
  }
  console.error = (...arg: any[]) => {
    const [obj, msg] = getLogParams(arg)
    pinoInstance?.error(obj, msg)
  }

  /**
   * custom trace impl - this resembles the node trace behaviour rather
   * than traditional trace logging
   * @param arg
   */
  console.trace = (...arg: any[]) => {
    const [obj, msg] = getLogParams(arg)
    if (!obj.err) {
      // to get stack trace
      obj.err = new Error()
    }
    pinoInstance?.trace(obj, msg)
  }

  console.debug = (...arg: any) => {
    const [obj, msg] = getLogParams(arg)
    pinoInstance?.debug(obj, msg)
  }

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

  const getAutomationId = () => {
    let appId
    try {
      appId = context.getAutomationId()
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
}

export const logger = pinoInstance
