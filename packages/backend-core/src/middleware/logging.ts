const correlator = require("correlation-id")
import { Header } from "../constants"
import { v4 as uuid } from "uuid"
import * as context from "../context"

const debug = console.warn
const trace = console.trace
const log = console.log
const info = console.info
const warn = console.warn
const error = console.error

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

const getIdentityId = () => {
  let identityId
  try {
    const identity = context.getIdentity()
    identityId = identity?._id
  } catch (e) {
    // do nothing
  }
  return identityId
}

const print = (fn: any, data: any[]) => {
  let message = ""

  const correlationId = correlator.getId()
  if (correlationId) {
    message = message + `[correlationId=${correlator.getId()}]`
  }

  const tenantId = getTenantId()
  if (tenantId) {
    message = message + ` [tenantId=${tenantId}]`
  }

  const appId = getAppId()
  if (appId) {
    message = message + ` [appId=${appId}]`
  }

  const identityId = getIdentityId()
  if (identityId) {
    message = message + ` [identityId=${identityId}]`
  }

  fn(message, data)
}

const logging = (ctx: any, next: any) => {
  // use the provided correlation id header if present
  let correlationId = ctx.headers[Header.CORRELATION_ID]
  if (!correlationId) {
    correlationId = uuid()
  }

  return correlator.withId(correlationId, () => {
    console.debug = data => print(debug, data)
    console.trace = data => print(trace, data)
    console.log = data => print(log, data)
    console.info = data => print(info, data)
    console.warn = data => print(warn, data)
    console.error = data => print(error, data)
    return next()
  })
}

export default logging
