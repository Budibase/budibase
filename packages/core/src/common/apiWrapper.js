import { cloneDeep, isUndefined } from "lodash/fp"
import { generate } from "shortid"
import { UnauthorisedError } from "./errors"

export const apiWrapper = async (
  app,
  eventNamespace,
  isAuthorized,
  eventContext,
  func,
  ...params
) => {
  pushCallStack(app, eventNamespace)

  if (!isAuthorized(app)) {
    handleNotAuthorized(app, eventContext, eventNamespace)
    return
  }

  const startDate = Date.now()
  const elapsed = () => Date.now() - startDate

  try {
    await app.publish(eventNamespace.onBegin, eventContext)

    const result = await func(...params)

    await publishComplete(app, eventContext, eventNamespace, elapsed, result)
    return result
  } catch (error) {
    await publishError(app, eventContext, eventNamespace, elapsed, error)
    throw error
  }
}

export const apiWrapperSync = (
  app,
  eventNamespace,
  isAuthorized,
  eventContext,
  func,
  ...params
) => {
  pushCallStack(app, eventNamespace)

  if (!isAuthorized(app)) {
    handleNotAuthorized(app, eventContext, eventNamespace)
    return
  }

  const startDate = Date.now()
  const elapsed = () => Date.now() - startDate

  try {
    app.publish(eventNamespace.onBegin, eventContext)

    const result = func(...params)

    publishComplete(app, eventContext, eventNamespace, elapsed, result)
    return result
  } catch (error) {
    publishError(app, eventContext, eventNamespace, elapsed, error)
    throw error
  }
}

const handleNotAuthorized = (app, eventContext, eventNamespace) => {
  const err = new UnauthorisedError(`Unauthorized: ${eventNamespace}`)
  publishError(app, eventContext, eventNamespace, () => 0, err)
  throw err
}

const pushCallStack = (app, eventNamespace, seedCallId) => {
  const callId = generate()

  const createCallStack = () => ({
    seedCallId: !isUndefined(seedCallId) ? seedCallId : callId,
    threadCallId: callId,
    stack: [],
  })

  if (isUndefined(app.calls)) {
    app.calls = createCallStack()
  }

  app.calls.stack.push({
    namespace: eventNamespace,
    callId,
  })
}

const popCallStack = app => {
  app.calls.stack.pop()
  if (app.calls.stack.length === 0) {
    delete app.calls
  }
}

const publishError = async (
  app,
  eventContext,
  eventNamespace,
  elapsed,
  err
) => {
  const ctx = cloneDeep(eventContext)
  ctx.error = err
  ctx.elapsed = elapsed()
  await app.publish(eventNamespace.onError, ctx)
  popCallStack(app)
}

const publishComplete = async (
  app,
  eventContext,
  eventNamespace,
  elapsed,
  result
) => {
  const endcontext = cloneDeep(eventContext)
  endcontext.result = result
  endcontext.elapsed = elapsed()
  await app.publish(eventNamespace.onComplete, endcontext)
  popCallStack(app)
  return result
}

export default apiWrapper
