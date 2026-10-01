import { LockName, LockOptions, LockType } from "@budibase/types"
import Redlock from "redlock"
import { DBTestConfiguration, generator } from "../../../tests"
import { AUTO_EXTEND_POLLING_MS, doWithLock } from "../redlockImpl"

describe("redlockImpl", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  describe("doWithLock", () => {
    const config = new DBTestConfiguration()
    const lockTtl = AUTO_EXTEND_POLLING_MS

    function runLockWithExecutionTime({
      opts,
      task,
      executionTimeMs,
    }: {
      opts: LockOptions
      task: () => Promise<string>
      executionTimeMs: number
    }) {
      return config.doInTenant(() =>
        doWithLock(opts, async () => {
          // Run in multiple intervals until hitting the expected time
          const interval = lockTtl / 10
          for (let i = executionTimeMs; i > 0; i -= interval) {
            await jest.advanceTimersByTimeAsync(interval)
          }
          return task()
        })
      )
    }

    it.each(Object.values(LockType))(
      "should return the task value and release the lock",
      async (lockType: LockType) => {
        const expectedResult = generator.guid()
        const mockTask = jest.fn().mockResolvedValue(expectedResult)

        const opts: LockOptions = {
          name: LockName.PERSIST_WRITETHROUGH,
          type: lockType,
          ttl: lockTtl,
        }

        const result = await runLockWithExecutionTime({
          opts,
          task: mockTask,
          executionTimeMs: 0,
        })

        expect(result.executed).toBe(true)
        expect(result.executed && result.result).toBe(expectedResult)
        expect(mockTask).toHaveBeenCalledTimes(1)
      }
    )

    it("should extend when type is autoextend", async () => {
      const expectedResult = generator.guid()
      const mockTask = jest.fn().mockResolvedValue(expectedResult)
      const mockOnExtend = jest.fn()

      const opts: LockOptions = {
        name: LockName.PERSIST_WRITETHROUGH,
        type: LockType.AUTO_EXTEND,
        onExtend: mockOnExtend,
      }

      const result = await runLockWithExecutionTime({
        opts,
        task: mockTask,
        executionTimeMs: lockTtl * 2.5,
      })

      expect(result.executed).toBe(true)
      expect(result.executed && result.result).toBe(expectedResult)
      expect(mockTask).toHaveBeenCalledTimes(1)
      expect(mockOnExtend).toHaveBeenCalledTimes(5)
    })

    it("should keep a custom autoextend lock through a delayed timer", async () => {
      const onExtend = jest.fn()
      const result = await config.doInTenant(() =>
        doWithLock(
          {
            name: LockName.SQS_SYNC_DEFINITIONS,
            type: LockType.AUTO_EXTEND,
            ttl: 60_000,
            onExtend,
          },
          async () => {
            jest.advanceTimersByTime(25_000)
            return "completed"
          }
        )
      )

      expect(result).toEqual({ executed: true, result: "completed" })
      expect(onExtend).not.toHaveBeenCalled()
    })

    it("should extend a custom autoextend lock on the ttl/2 cadence", async () => {
      const customTtl = 60_000
      const onExtend = jest.fn()
      const result = await config.doInTenant(() =>
        doWithLock(
          {
            name: LockName.SQS_SYNC_DEFINITIONS,
            type: LockType.AUTO_EXTEND,
            ttl: customTtl,
            onExtend,
          },
          async () => {
            // advance in small increments so pending extend timers actually fire
            const interval = customTtl / 10
            for (let i = customTtl * 1.1; i > 0; i -= interval) {
              await jest.advanceTimersByTimeAsync(interval)
            }
            return "completed"
          }
        )
      )

      expect(result).toEqual({ executed: true, result: "completed" })
      // extends expected at 30s and 60s for a 60s ttl
      expect(onExtend).toHaveBeenCalledTimes(2)
    })

    it("should keep extending after a transient extend failure", async () => {
      const customTtl = 60_000
      const onExtend = jest.fn()

      // fully fake lock so there's no real redis-backed expiry racing with
      // the mocked extend failure below
      const fakeLock: any = { value: "token" }
      fakeLock.extend = jest
        .fn()
        .mockRejectedValueOnce(new Error("transient redis error"))
        .mockImplementation(async (_ttl: number, cb?: () => void) => {
          cb && cb()
          return fakeLock
        })
      fakeLock.unlock = jest.fn().mockResolvedValue(undefined)

      const lockSpy = jest
        .spyOn(Redlock.prototype, "lock")
        .mockResolvedValue(fakeLock)

      const result = await config.doInTenant(() =>
        doWithLock(
          {
            name: LockName.SQS_SYNC_DEFINITIONS,
            type: LockType.AUTO_EXTEND,
            ttl: customTtl,
            onExtend,
          },
          async () => {
            const interval = customTtl / 10
            for (let i = customTtl * 1.1; i > 0; i -= interval) {
              await jest.advanceTimersByTimeAsync(interval)
            }
            return "completed"
          }
        )
      )

      expect(result).toEqual({ executed: true, result: "completed" })
      expect(fakeLock.extend).toHaveBeenCalledTimes(2)
      // the first extend failed and was swallowed, the chain kept going
      expect(onExtend).toHaveBeenCalledTimes(1)
      expect(fakeLock.unlock).toHaveBeenCalledTimes(1)

      lockSpy.mockRestore()
    })

    it.each(Object.values(LockType).filter(t => t !== LockType.AUTO_EXTEND))(
      "should timeout when type is %s",
      async (lockType: LockType) => {
        const mockTask = jest.fn().mockResolvedValue("mockResult")

        const opts: LockOptions = {
          name: LockName.PERSIST_WRITETHROUGH,
          type: lockType,
          ttl: lockTtl,
        }

        await expect(
          runLockWithExecutionTime({
            opts,
            task: mockTask,
            executionTimeMs: lockTtl * 2,
          })
        ).rejects.toThrow(
          `Unable to fully release the lock on resource "lock:${config.tenantId}_persist_writethrough".`
        )
      }
    )
  })
})
