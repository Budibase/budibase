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
  }
})

import { doWithProjectAssignmentsLock } from "../lock"

const getWorkspaceId = backendCore.context
  .getWorkspaceId as jest.MockedFunction<
  typeof backendCore.context.getWorkspaceId
>
const doWithLock = backendCore.locks.doWithLock as jest.MockedFunction<
  typeof backendCore.locks.doWithLock
>

describe("Project assignments lock", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    getWorkspaceId.mockReturnValue("app_dev_workspace")
    doWithLock.mockImplementation(async (_options, fn) => ({
      executed: true,
      result: await fn(),
    }))
  })

  it("rejects assignments without a workspace", async () => {
    getWorkspaceId.mockReturnValue(undefined)

    await expect(
      doWithProjectAssignmentsLock(async () => undefined)
    ).rejects.toThrow(
      "Could not determine workspace for Project assignments lock"
    )
  })

  it("uses an explicit destination workspace", async () => {
    await doWithProjectAssignmentsLock(async () => undefined, "app_dev_target")

    expect(doWithLock).toHaveBeenCalledWith(
      expect.objectContaining({ resource: "app_target" }),
      expect.any(Function)
    )
  })

  it("runs assignments under the workspace lock", async () => {
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
})
