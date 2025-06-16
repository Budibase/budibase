import { utils } from "../index"

describe("parallelForeach", () => {
  let originalUnhandledRejection: any
  let unhandledRejectionErrors: Error[] = []

  beforeEach(() => {
    unhandledRejectionErrors = []
    
    // Capture unhandled promise rejections for testing
    originalUnhandledRejection = process.listeners('unhandledRejection')
    process.removeAllListeners('unhandledRejection')
    process.on('unhandledRejection', (reason: Error) => {
      unhandledRejectionErrors.push(reason)
    })
  })

  afterEach(() => {
    // Restore original unhandled rejection listeners
    process.removeAllListeners('unhandledRejection')
    originalUnhandledRejection.forEach((listener: any) => {
      process.on('unhandledRejection', listener)
    })
  })

  it("should handle successful parallel execution", async () => {
    const results: number[] = []
    const items = [1, 2, 3]
    
    await utils.parallelForeach(
      items,
      async (item) => {
        await new Promise(resolve => setTimeout(resolve, 10)) // Small delay
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
  })

  it("should handle errors without unhandled promise rejections", async () => {
    // This test verifies that our fix prevents unhandled promise rejections
    // Even when some tasks fail in a parallel processing scenario
    
    const items = [1, 2, 3, 4, 5, 6, 7, 8]
    
    await expect(
      utils.parallelForeach(
        items,
        async (item) => {
          if (item === 5) {
            // This task will fail and should be properly handled
            await new Promise(resolve => setTimeout(resolve, 50))
            throw new Error(`Task ${item} failed`)
          }
          // Other tasks complete successfully  
          await new Promise(resolve => setTimeout(resolve, 10))
        },
        3 // Concurrency of 3
      )
    ).rejects.toThrow("Task 5 failed")

    // Wait for any unhandled rejections to surface
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // The key assertion: no unhandled promise rejections should occur
    expect(unhandledRejectionErrors.length).toBe(0)
  })
})