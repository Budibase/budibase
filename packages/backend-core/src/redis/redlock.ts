import Redlock, { Options } from "redlock"
import { getLockClient } from "./init"
import { LockOptions, LockType } from "@budibase/types"
import * as tenancy from "../tenancy"

let noRetryRedlock: Redlock | undefined

const getClient = async (type: LockType): Promise<Redlock> => {
  switch (type) {
    case LockType.TRY_ONCE: {
      if (!noRetryRedlock) {
        noRetryRedlock = await newRedlock(OPTIONS.TRY_ONCE)
      }
      return noRetryRedlock
    }
    default: {
      throw new Error(`Could not get redlock client: ${type}`)
    }
  }
}

export const OPTIONS = {
  TRY_ONCE: {
    // immediately throws an error if the lock is already held
    retryCount: 0,
  },
  DEFAULT: {
    // the expected clock drift; for more details
    // see http://redis.io/topics/distlock
    driftFactor: 0.01, // multiplied by lock ttl to determine drift time

    // the max number of times Redlock will attempt
    // to lock a resource before erroring
    retryCount: 10,

    // the time in ms between attempts
    retryDelay: 200, // time in ms

    // the max time in ms randomly added to retries
    // to improve performance under high contention
    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
    retryJitter: 100, // time in ms
  },
}

export const newRedlock = async (opts: Options = {}) => {
  let options = { ...OPTIONS.DEFAULT, ...opts }
  const redisWrapper = await getLockClient()
  const client = redisWrapper.getClient()
  return new Redlock([client], options)
}

export const doWithLock = async (opts: LockOptions, task: any) => {
  const redlock = await getClient(opts.type)
  let lock
  try {
    // aquire lock
    let name: string
    if (opts.systemLock) {
      name = opts.name
    } else {
      name = `${tenancy.getTenantId()}_${opts.name}`
    }
    if (opts.nameSuffix) {
      name = name + `_${opts.nameSuffix}`
    }
    lock = await redlock.lock(name, opts.ttl)
    // perform locked task
    return task()
  } catch (e: any) {
    // lock limit exceeded
    if (e.name === "LockError") {
      if (opts.type === LockType.TRY_ONCE) {
        // don't throw for try-once locks, they will always error
        // due to retry count (0) exceeded
        return
      } else {
        throw e
      }
    } else {
      throw e
    }
  } finally {
    if (lock) {
      await lock.unlock()
    }
  }
}
