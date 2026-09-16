import { LockName, LockType } from "@budibase/types"

const mockDoWithLock = jest.fn()
jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  locks: {
    ...jest.requireActual("@budibase/backend-core").locks,
    doWithLock: (...args: unknown[]) => mockDoWithLock(...args),
  },
}))

import sdk from "../../../../../sdk"

const { waitForDefinitionRebuild } = sdk.tables.sqs

describe("waitForDefinitionRebuild", () => {
  beforeEach(() => {
    mockDoWithLock.mockReset()
  })

  it("resolves immediately when the rebuild lock is free", async () => {
    mockDoWithLock.mockResolvedValue({ executed: true, result: undefined })

    await expect(
      waitForDefinitionRebuild("workspace_1")
    ).resolves.toBeUndefined()

    expect(mockDoWithLock).toHaveBeenCalledTimes(1)
    expect(mockDoWithLock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: LockType.TRY_ONCE,
        name: LockName.SQS_SYNC_DEFINITIONS,
        resource: "workspace_1",
      }),
      expect.any(Function)
    )
  })

  it("keeps polling while the rebuild lock is held and returns once it releases", async () => {
    mockDoWithLock
      .mockResolvedValueOnce({ executed: false })
      .mockResolvedValueOnce({ executed: false })
      .mockResolvedValueOnce({ executed: true, result: undefined })

    await expect(
      waitForDefinitionRebuild("workspace_2")
    ).resolves.toBeUndefined()

    expect(mockDoWithLock).toHaveBeenCalledTimes(3)
  })

  it("gives up and continues anyway once the max wait is exceeded", async () => {
    jest.useFakeTimers()
    try {
      mockDoWithLock.mockResolvedValue({ executed: false })

      const promise = waitForDefinitionRebuild("workspace_3")
      await jest.advanceTimersByTimeAsync(20000)
      await expect(promise).resolves.toBeUndefined()

      expect(mockDoWithLock.mock.calls.length).toBeGreaterThan(1)
    } finally {
      jest.useRealTimers()
    }
  })

  it("does not throw when the lock check fails for an unrelated reason", async () => {
    mockDoWithLock.mockRejectedValue(new Error("ECONNREFUSED"))

    await expect(
      waitForDefinitionRebuild("workspace_4")
    ).resolves.toBeUndefined()

    expect(mockDoWithLock).toHaveBeenCalledTimes(1)
  })

  it("avoids re-checking redis for a short window after confirming the lock is free", async () => {
    mockDoWithLock.mockResolvedValue({ executed: true, result: undefined })

    await waitForDefinitionRebuild("workspace_5")
    await waitForDefinitionRebuild("workspace_5")
    await waitForDefinitionRebuild("workspace_5")

    expect(mockDoWithLock).toHaveBeenCalledTimes(1)
  })

  it("re-checks redis for a different workspace even if another one is cached as free", async () => {
    mockDoWithLock.mockResolvedValue({ executed: true, result: undefined })

    await waitForDefinitionRebuild("workspace_6")
    await waitForDefinitionRebuild("workspace_7")

    expect(mockDoWithLock).toHaveBeenCalledTimes(2)
  })
})
