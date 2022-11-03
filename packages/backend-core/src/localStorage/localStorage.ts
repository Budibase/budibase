import { AsyncLocalStorage } from "async_hooks"
import { Ctx } from "@budibase/types"

interface LocalStorage {
  ctx: Ctx
}

const asyncLocalStorage = new AsyncLocalStorage<LocalStorage>()

export const run = (storage: LocalStorage, fn: any) => {
  return asyncLocalStorage.run(storage, () => fn())
}

export const getCtx = (): Ctx => {
  const store = asyncLocalStorage.getStore()
  if (!store) {
    throw new Error("Ctx storage has not been initialised")
  }
  return store.ctx
}

export const getReferrer = () => {
  const ctx = getCtx()
  const referrer = ctx.request.headers["referer"]
  if (referrer) {
    return new URL(referrer)
  } else {
    throw new Error("Could not determine referer")
  }
}
