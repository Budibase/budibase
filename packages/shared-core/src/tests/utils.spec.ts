import { utils } from "../index"

describe("parallelForeach", () => {
  let originalUnhandledRejection: any
  let unhandledRejectionErrors: Error[] = []

  beforeEach(() => {
    unhandledRejectionErrors = []

    // Capture unhandled promise rejections for testing
    originalUnhandledRejection = process.listeners("unhandledRejection")
    process.removeAllListeners("unhandledRejection")
    process.on("unhandledRejection", (reason: Error) => {
      unhandledRejectionErrors.push(reason)
    })
  })

  afterEach(async () => {
    // Wait a bit for any lingering promises to settle
    await new Promise(resolve => setTimeout(resolve, 10))
    
    // Restore original unhandled rejection listeners
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

    let caughtError: Error | null = null
    try {
      await utils.parallelForeach(
        items,
        async item => {
          if (item === 5) {
            // Add small delay to make timing more realistic
            await new Promise(resolve => setTimeout(resolve, 10))
            throw new Error(`Task ${item} failed`)
          }
          // Other tasks complete successfully  
          await new Promise(resolve => setTimeout(resolve, 5))
        },
        3
      )
    } catch (error) {
      caughtError = error as Error
    }

    // Verify the error was caught and is the expected error
    expect(caughtError).toBeTruthy()
    expect(caughtError?.message).toBe("Task 5 failed")

    // Wait a bit for any potential unhandled rejections to surface
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(unhandledRejectionErrors.length).toBe(0)
  })
})
