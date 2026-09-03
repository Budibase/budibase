import * as backendCore from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

jest.mock("@budibase/backend-core", (): typeof backendCore => {
  const actual: typeof backendCore = jest.requireActual(
    "@budibase/backend-core"
  )
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceId: jest.fn(),
    },
    locks: {
      ...actual.locks,
      doWithLock: jest.fn(),
    },
    features: {
      ...actual.features,
      isEnabled: jest.fn(),
    },
  }
})

import {
  doWithProjectAssignmentsLock,
  doWithProjectAssignmentsLockIfEnabled,
} from "../lock"

const getWorkspaceId = backendCore.context
  .getWorkspaceId as jest.MockedFunction<
  typeof backendCore.context.getWorkspaceId
>
const doWithLock = backendCore.locks.doWithLock as jest.MockedFunction<
  typeof backendCore.locks.doWithLock
>
const isEnabled = backendCore.features.isEnabled as jest.MockedFunction<
  typeof backendCore.features.isEnabled
>

describe("Project assignments lock", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getWorkspaceId.mockReturnValue("app_dev_workspace")
    doWithLock.mockImplementation(async (_options, fn) => ({
      executed: true,
      result: await fn(),
    }))
  })

  it("uses an auto-extending production workspace lock", async () => {
    await expect(
      doWithProjectAssignmentsLock(async () => "result")
    ).resolves.toBe("result")

    expect(doWithLock).toHaveBeenCalledWith(
      {
        name: LockName.PROJECT_ASSIGNMENTS,
        type: LockType.AUTO_EXTEND,
        resource: "app_workspace",
      },
      expect.any(Function)
    )
  })

  it("uses an explicit destination workspace", async () => {
    await doWithProjectAssignmentsLock(async () => undefined, "app_dev_target")

    expect(doWithLock).toHaveBeenCalledWith(
      expect.objectContaining({ resource: "app_target" }),
      expect.any(Function)
    )
  })

  it("returns callback errors", async () => {
    const error = new Error("failed")

    await expect(
      doWithProjectAssignmentsLock(async () => {
        throw error
      })
    ).rejects.toBe(error)
  })

  it("skips the lock when Projects is disabled", async () => {
    isEnabled.mockResolvedValue(false)

    await expect(
      doWithProjectAssignmentsLockIfEnabled(async () => "result")
    ).resolves.toBe("result")

    expect(doWithLock).not.toHaveBeenCalled()
  })

  it("uses the lock when Projects is enabled", async () => {
    isEnabled.mockResolvedValue(true)

    await expect(
      doWithProjectAssignmentsLockIfEnabled(async () => "result")
    ).resolves.toBe("result")

    expect(doWithLock).toHaveBeenCalledTimes(1)
  })
})
