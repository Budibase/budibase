import { utils } from "../index"

describe("parallelForeach", () => {
  let originalUnhandledRejection: any
  let unhandledRejectionErrors: Error[] = []

  beforeEach(() => {
    unhandledRejectionErrors = []
    originalUnhandledRejection = process.listeners("unhandledRejection")
    process.removeAllListeners("unhandledRejection")
    process.on("unhandledRejection", (reason: Error) => {
      unhandledRejectionErrors.push(reason)
    })
  })

  afterEach(async () => {
    process.removeAllListeners("unhandledRejection")
    originalUnhandledRejection.forEach((listener: any) => {
      process.on("unhandledRejection", listener)
    })
  })

  it("should handle successful parallel execution", async () => {
    const results: number[] = []
    const items = [1, 2, 3]

    await utils.parallelForeach(
      items,
      async item => {
        results.push(item * 2)
      },
      2
    )

    expect(results.sort()).toEqual([2, 4, 6])
    expect(unhandledRejectionErrors).toHaveLength(0)
  })

  it("should propagate errors when all tasks fail", async () => {
    const items = [1, 2, 3]

    await expect(
      utils.parallelForeach(
        items,
        async () => {
          throw new Error("Task failed")
        },
        2
      )
    ).rejects.toThrow("Task failed")

    expect(unhandledRejectionErrors).toHaveLength(0)
  })

  it("should handle errors without unhandled promise rejections", async () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8]

    await expect(
      utils.parallelForeach(
        items,
        async item => {
          if (item === 5) {
            throw new Error(`Task ${item} failed`)
          }
        },
        3
      )
    ).rejects.toThrow("Task 5 failed")

    expect(unhandledRejectionErrors.length).toBe(0)
  })

  it("should never run more than maxConcurrency tasks at once", async () => {
    const items = Array.from({ length: 10 }, (_, i) => i + 1)
    let runningTasks = 0

    await utils.parallelForeach(
      items,
      async () => {
        runningTasks++
        expect(runningTasks).toBeLessThanOrEqual(3) // maxConcurrency is 3
        await new Promise(resolve => setTimeout(resolve, 20)) // Simulate work
        runningTasks--
      },
      3
    )

    expect(unhandledRejectionErrors).toHaveLength(0)
  })
})
