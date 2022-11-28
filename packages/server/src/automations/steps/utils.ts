import { EventEmitter } from "events"

export async function getFetchResponse(fetched: any) {
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
// opts can contain, body, params and version
export function buildCtx(
  appId: string,
  emitter?: EventEmitter | null,
  opts: any = {}
) {
  const ctx: any = {
    appId,
    user: { appId },
    eventEmitter: emitter,
    throw: (code: string, error: any) => {
      throw error
    },
  }
  if (opts.body) {
    ctx.request = { body: opts.body }
  }
  if (opts.params) {
    ctx.params = opts.params
  }
  if (opts.version) {
    ctx.version = opts.version
  }
  return ctx
}
