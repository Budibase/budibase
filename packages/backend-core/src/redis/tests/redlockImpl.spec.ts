import { LockName, LockType } from "@budibase/types"
import { doWithLock } from "../redlockImpl"
import { DBTestConfiguration } from "../../../tests"

describe("redlockImpl", () => {
  describe("doWithLock", () => {
    it("should execute the task and return the result", async () => {
      const mockTask = jest.fn().mockResolvedValue("mockResult")

      // Define test options
      const testOpts = {
        name: LockName.PERSIST_WRITETHROUGH,
        type: LockType.AUTO_EXTEND,
        ttl: 5,
      }

      // Call the function with the mock lock and task
      const config = new DBTestConfiguration()
      const result = await config.doInTenant(() =>
        doWithLock(testOpts, async () => {
          await new Promise<void>(r => setTimeout(() => r(), 10))
          return mockTask()
        })
      )

      // Assert the result and verify function calls
      expect(result.executed).toBe(true)
      expect(result.executed && result.result).toBe("mockResult")
      expect(mockTask).toHaveBeenCalledTimes(1)
    })
  })
})
