import { db as dbCore } from "@budibase/backend-core"
import { notifyActionSessionChange } from "./actionSessionChanges"
import { builderSocket } from "./index"

jest.mock("./index", () => ({
  builderSocket: { emitActionSessionChange: jest.fn() },
}))

const emitMock = builderSocket!.emitActionSessionChange as jest.Mock

describe("notifyActionSessionChange", () => {
  const workspaceId = dbCore.generateWorkspaceID()
  const devWorkspaceId = dbCore.getDevWorkspaceID(workspaceId)

  beforeEach(() => {
    emitMock.mockReset()
  })

  it.each([
    ["prod", workspaceId],
    ["dev", devWorkspaceId],
  ])(
    "emits the change to the dev workspace room from a %s workspace ID",
    (_, changedWorkspaceId) => {
      notifyActionSessionChange({
        workspaceId: changedWorkspaceId,
        environment: "prod",
        sourceType: "automation_run",
        sourceId: "run-1",
      })

      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(emitMock).toHaveBeenCalledWith(devWorkspaceId, {
        environment: "prod",
        sourceType: "automation_run",
        sourceId: "run-1",
      })
    }
  )
})
