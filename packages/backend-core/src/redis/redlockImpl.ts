import Redlock from "redlock"
import { getLockClient } from "./init"
import { LockOptions, LockType } from "@budibase/types"
import * as context from "../context"
import { utils } from "@budibase/shared-core"
import { Duration } from "../utils"

async function getClient(
  type: LockType,
  opts?: Redlock.Options
): Promise<Redlock> {
  if (type === LockType.CUSTOM) {
    return newRedlock(opts)
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
    case LockType.AUTO_EXTEND: {
      return newRedlock(OPTIONS.AUTO_EXTEND)
    }
    default: {
      throw utils.unreachable(type)
    }
  }
}

const OPTIONS: Record<keyof typeof LockType, Redlock.Options> = {
  TRY_ONCE: {
    // immediately throws an error if the lock is already held
    retryCount: 0,
  },
  TRY_TWICE: {
    retryCount: 1,
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
  CUSTOM: {},
  AUTO_EXTEND: {
    retryCount: -1,
  },
}

export async function newRedlock(opts: Redlock.Options = {}) {
  const options = { ...OPTIONS.DEFAULT, ...opts }
  const redisWrapper = await getLockClient()
  const client = redisWrapper.getClient() as any
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
  let name = `lock:${prefix}_${opts.name}`
  // add additional unique name if required
  if (opts.resource) {
    name = name + `_${opts.resource}`
  }
  return name
}

export const AUTO_EXTEND_POLLING_MS = Duration.fromSeconds(10).toMs()

export async function doWithLock<T>(
  opts: LockOptions,
  task: () => Promise<T>
): Promise<RedlockExecution<T>> {
  const redlock = await getClient(opts.type, opts.customOptions)
  let lock: Redlock.Lock | undefined
  let timeout
  try {
    const name = getLockName(opts)

    const ttl =
      opts.type === LockType.AUTO_EXTEND ? AUTO_EXTEND_POLLING_MS : opts.ttl

    // create the lock
    lock = await redlock.lock(name, ttl)

    if (opts.type === LockType.AUTO_EXTEND) {
      // We keep extending the lock while the task is running
      const extendInIntervals = (): void => {
        timeout = setTimeout(async () => {
          lock = await lock!.extend(ttl, () => opts.onExtend && opts.onExtend())

          extendInIntervals()
        }, ttl / 2)
      }

      extendInIntervals()
    }

    // perform locked task
    // need to await to ensure completion before unlocking
    const result = await task()
    return { executed: true, result }
  } catch (e: any) {
    // lock limit exceeded
    if (e.name === "LockError") {
      if (opts.type === LockType.TRY_ONCE) {
        // don't throw for try-once locks, they will always error
        // due to retry count (0) exceeded
        return { executed: false }
      } else {
        throw e
      }
    } else {
      throw e
    }
  } finally {
    clearTimeout(timeout)
    await lock?.unlock()
  }
}
