jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: jest.fn(),
    },
  }
})

jest.mock("../../../utilities", () => {
  const actual = jest.requireActual("../../../utilities")
  return {
    ...actual,
    updateEntityMetadata: jest.fn(),
  }
})

import { context } from "@budibase/backend-core"
import { MetadataType } from "@budibase/types"
import { getLastSeenUid, setLastSeenUid } from "../../email/state"
import { updateEntityMetadata } from "../../../utilities"

const getWorkspaceDBMock = context.getWorkspaceDB as jest.Mock
const updateEntityMetadataMock = updateEntityMetadata as jest.Mock

describe("email state persistence", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getLastSeenUid", () => {
    it("returns undefined when no metadata document exists", async () => {
      const automationId = "auto-none"
      const tryGet = jest.fn().mockResolvedValue(undefined)
      getWorkspaceDBMock.mockReturnValueOnce({ tryGet })

      const result = await getLastSeenUid(automationId)

      expect(result).toBeUndefined()
      expect(tryGet).toHaveBeenCalledWith(
        `metadata_${MetadataType.AUTOMATION_EMAIL_STATE}_${automationId}`
      )
    })

    it("returns the stored UID when present", async () => {
      const automationId = "auto-valid"
      const tryGet = jest.fn().mockResolvedValue({ lastSeenUid: 42 })
      getWorkspaceDBMock.mockReturnValueOnce({ tryGet })

      const result = await getLastSeenUid(automationId)

      expect(result).toBe(42)
      expect(tryGet).toHaveBeenCalledWith(
        `metadata_${MetadataType.AUTOMATION_EMAIL_STATE}_${automationId}`
      )
    })
  })

  describe("setLastSeenUid", () => {
    it("persists the UID via updateEntityMetadata", async () => {
      const automationId = "auto-update"
      updateEntityMetadataMock.mockResolvedValue({})

      await setLastSeenUid(automationId, 99)

      expect(updateEntityMetadataMock).toHaveBeenCalledWith(
        MetadataType.AUTOMATION_EMAIL_STATE,
        automationId,
        expect.any(Function)
      )

      const [, , updater] = updateEntityMetadataMock.mock.calls[0]
      const existing = { someField: "value" }
      expect(updater(existing)).toEqual({
        someField: "value",
        lastSeenUid: 99,
      })
    })
  })
})
