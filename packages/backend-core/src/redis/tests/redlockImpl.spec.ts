import { LockName, LockType } from "@budibase/types"
import { doWithLock } from "../redlockImpl"
import { DBTestConfiguration } from "../../../tests"
import { Duration } from "../../utils"

describe("redlockImpl", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe("doWithLock", () => {
    it("should execute the task and return the result", async () => {
      const mockTask = jest.fn().mockResolvedValue("mockResult")

      // Define test options
      const testOpts = {
        name: LockName.PERSIST_WRITETHROUGH,
        type: LockType.AUTO_EXTEND,
        ttl: 30000,
      }

      // Call the function with the mock lock and task
      const config = new DBTestConfiguration()
      const result = await config.doInTenant(() =>
        doWithLock(testOpts, async () => {
          jest.advanceTimersByTime(Duration.fromSeconds(10).toMs())
          jest.advanceTimersByTime(Duration.fromSeconds(10).toMs())
          jest.advanceTimersByTime(Duration.fromSeconds(10).toMs())
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
