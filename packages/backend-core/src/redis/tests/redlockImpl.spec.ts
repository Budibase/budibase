import { LockName, LockType, LockOptions } from "@budibase/types"
import { AUTO_EXTEND_POLLING_MS, doWithLock } from "../redlockImpl"
import { DBTestConfiguration, generator } from "../../../tests"

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
