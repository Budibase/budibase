exports.getFetchResponse = async fetched => {
  let status = fetched.status,
    message
  const contentType = fetched.headers.get("content-type")
  try {
    if (contentType && contentType.indexOf("application/json") !== -1) {
      message = await fetched.json()
    } else {
      message = await fetched.text()
    }
  } catch (err) {
    message = "Failed to retrieve response"
  }
  return { status, message }
}

// need to make sure all ctx structures have the
// throw added to them, so that controllers don't
// throw a ctx.throw undefined when error occurs
exports.buildCtx = (appId, emitter, { body, params } = {}) => {
  const ctx = {
    appId,
    user: { appId },
    eventEmitter: emitter,
    throw: (code, error) => {
      throw error
    },
  }
  if (body) {
    ctx.request = { body }
  }
  if (params) {
    ctx.params = params
  }
  return ctx
}
