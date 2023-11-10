import Redlock from "redlock"
import { getLockClient } from "./init"
import { LockOptions, LockType } from "@budibase/types"
import * as context from "../context"
import env from "../environment"

async function getClient(
  type: LockType,
  opts?: Redlock.Options
): Promise<Redlock> {
  if (type === LockType.CUSTOM) {
    return newRedlock(opts)
  }
  if (env.isTest() && type !== LockType.TRY_ONCE) {
    return newRedlock(OPTIONS.TEST)
  }
  switch (type) {
    case LockType.TRY_ONCE: {
      return newRedlock(OPTIONS.TRY_ONCE)
    }
    case LockType.TRY_TWICE: {
      return newRedlock(OPTIONS.TRY_TWICE)
    }
    case LockType.DEFAULT: {
      return newRedlock(OPTIONS.DEFAULT)
    }
    case LockType.DELAY_500: {
      return newRedlock(OPTIONS.DELAY_500)
    }
    default: {
      throw new Error(`Could not get redlock client: ${type}`)
    }
  }
}

const OPTIONS = {
  TRY_ONCE: {
    // immediately throws an error if the lock is already held
    retryCount: 0,
  },
  TRY_TWICE: {
    retryCount: 1,
  },
  TEST: {
    // higher retry count in unit tests
    // due to high contention.
    retryCount: 100,
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
  DELAY_500: {
    retryDelay: 500,
  },
}

export async function newRedlock(opts: Redlock.Options = {}) {
  let options = { ...OPTIONS.DEFAULT, ...opts }
  const redisWrapper = await getLockClient()
  const client = redisWrapper.getClient()
  return new Redlock([client], options)
}

type SuccessfulRedlockExecution<T> = {
  executed: true
  result: T
}
type UnsuccessfulRedlockExecution = {
  executed: false
}

type RedlockExecution<T> =
  | SuccessfulRedlockExecution<T>
  | UnsuccessfulRedlockExecution

function getLockName(opts: LockOptions) {
  // determine lock name
  // by default use the tenantId for uniqueness, unless using a system lock
  const prefix = opts.systemLock ? "system" : context.getTenantId()
  let name: string = `lock:${prefix}_${opts.name}`
  // add additional unique name if required
  if (opts.resource) {
    name = name + `_${opts.resource}`
  }
  return name
}

export async function doWithLock<T>(
  opts: LockOptions,
  task: () => Promise<T>
): Promise<RedlockExecution<T>> {
  const redlock = await getClient(opts.type, opts.customOptions)
  let lock
  try {
    const name = getLockName(opts)

    // create the lock
    lock = await redlock.lock(name, opts.ttl)

    // perform locked task
    // need to await to ensure completion before unlocking
    const result = await task()
    return { executed: true, result }
  } catch (e: any) {
    console.warn("lock error")
    // lock limit exceeded
    if (e.name === "LockError") {
      if (opts.type === LockType.TRY_ONCE) {
        // don't throw for try-once locks, they will always error
        // due to retry count (0) exceeded
        return { executed: false }
      } else {
        console.error(e)
        throw e
      }
    } else {
      console.error(e)
      throw e
    }
  } finally {
    if (lock) {
      await lock.unlock()
    }
  }
}
