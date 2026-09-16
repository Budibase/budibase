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

  it("resolves when the rebuild lock is free", async () => {
    mockDoWithLock.mockResolvedValue({ executed: true, result: undefined })

    await expect(
      waitForDefinitionRebuild("workspace_1")
    ).resolves.toBeUndefined()

    expect(mockDoWithLock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: LockType.DEFAULT,
        name: LockName.SQS_SYNC_DEFINITIONS,
        resource: "workspace_1",
      }),
      expect.any(Function)
    )
  })

  it("does not throw when the rebuild lock is currently held", async () => {
    const lockError = new Error("Unable to acquire lock")
    lockError.name = "LockError"
    mockDoWithLock.mockRejectedValue(lockError)

    await expect(
      waitForDefinitionRebuild("workspace_1")
    ).resolves.toBeUndefined()
  })

  it("does not throw when the lock check fails for an unrelated reason", async () => {
    mockDoWithLock.mockRejectedValue(new Error("ECONNREFUSED"))

    await expect(
      waitForDefinitionRebuild("workspace_1")
    ).resolves.toBeUndefined()
  })
})
