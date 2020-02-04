import { split } from "lodash/fp"
import { $ } from "./index"

const lockOverlapMilliseconds = 10

export const getLock = async (
  app,
  lockFile,
  timeoutMilliseconds,
  maxLockRetries,
  retryCount = 0
) => {
  try {
    const timeout = (await app.getEpochTime()) + timeoutMilliseconds

    const lock = {
      timeout,
      key: lockFile,
      totalTimeout: timeoutMilliseconds,
    }

    await app.datastore.createFile(
      lockFile,
      getLockFileContent(lock.totalTimeout, lock.timeout)
    )

    return lock
  } catch (e) {
    if (retryCount == maxLockRetries) {
      return NO_LOCK
    }

    const lock = parseLockFileContent(
      lockFile,
      await app.datastore.loadFile(lockFile)
    )

    const currentEpochTime = await app.getEpochTime()

    if (currentEpochTime < lock.timeout) {
      return NO_LOCK
    }

    try {
      await app.datastore.deleteFile(lockFile)
    } catch (_) {
      //empty
    }

    await sleepForRetry()

    return await getLock(
      app,
      lockFile,
      timeoutMilliseconds,
      maxLockRetries,
      retryCount + 1
    )
  }
}

export const getLockFileContent = (totalTimeout, epochTime) =>
  `${totalTimeout}:${epochTime.toString()}`

const parseLockFileContent = (key, content) =>
  $(content, [
    split(":"),
    parts => ({
      totalTimeout: new Number(parts[0]),
      timeout: new Number(parts[1]),
      key,
    }),
  ])

export const releaseLock = async (app, lock) => {
  const currentEpochTime = await app.getEpochTime()
  // only release if not timedout
  if (currentEpochTime < lock.timeout - lockOverlapMilliseconds) {
    try {
      await app.datastore.deleteFile(lock.key)
    } catch (_) {
      //empty
    }
  }
}

export const extendLock = async (app, lock) => {
  const currentEpochTime = await app.getEpochTime()
  // only release if not timedout
  if (currentEpochTime < lock.timeout - lockOverlapMilliseconds) {
    try {
      lock.timeout = currentEpochTime + lock.timeoutMilliseconds
      await app.datastore.updateFile(
        lock.key,
        getLockFileContent(lock.totalTimeout, lock.timeout)
      )
      return lock
    } catch (_) {
      //empty
    }
  }
  return NO_LOCK
}

export const NO_LOCK = "no lock"
export const isNolock = id => id === NO_LOCK

const sleepForRetry = () =>
  new Promise(resolve => setTimeout(resolve, lockOverlapMilliseconds))
