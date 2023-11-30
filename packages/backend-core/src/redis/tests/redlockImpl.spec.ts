import { LockName, LockType, LockOptions } from "@budibase/types"
import tk from "timekeeper"
import { doWithLock } from "../redlockImpl"
import { DBTestConfiguration, generator } from "../../../tests"

tk.reset()

describe("redlockImpl", () => {
  describe("doWithLock", () => {
    const config = new DBTestConfiguration()
    const lockTtl = 30

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
          await new Promise<void>(r => setTimeout(() => r(), executionTimeMs))
          return task()
        })
      )
    }

    it.each(Object.values(LockType))(
      "should return the task value",
      async (lockType: LockType) => {
        const expectedResult = generator.guid()
        const mockTask = jest.fn().mockResolvedValue(expectedResult)

        const opts = {
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

      const opts = {
        name: LockName.PERSIST_WRITETHROUGH,
        type: LockType.AUTO_EXTEND,
        ttl: lockTtl,
      }

      const result = await runLockWithExecutionTime({
        opts,
        task: mockTask,
        executionTimeMs: lockTtl * 2,
      })

      expect(result.executed).toBe(true)
      expect(result.executed && result.result).toBe(expectedResult)
      expect(mockTask).toHaveBeenCalledTimes(1)
    })

    it.each(Object.values(LockType).filter(t => t !== LockType.AUTO_EXTEND))(
      "should timeout when type is %s",
      async (lockType: LockType) => {
        const mockTask = jest.fn().mockResolvedValue("mockResult")

        const opts = {
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
        ).rejects.toThrowError(
          `Unable to fully release the lock on resource \"lock:${config.tenantId}_persist_writethrough\".`
        )
      }
    )
  })
})
