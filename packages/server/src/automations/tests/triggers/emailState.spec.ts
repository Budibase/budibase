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
    it("returns undefined when the mailbox state doc is missing", async () => {
      const automationId = "auto-none"
      const mailbox = "dom"
      const tryGet = jest.fn().mockResolvedValue(undefined)
      getWorkspaceDBMock.mockReturnValueOnce({ tryGet })

      const result = await getLastSeenUid(automationId, mailbox)

      expect(result).toBeUndefined()
      expect(tryGet).toHaveBeenCalledTimes(1)
      expect(tryGet).toHaveBeenCalledWith(
        `metadata_${MetadataType.AUTOMATION_EMAIL_STATE}_${automationId}:${Buffer.from(
          mailbox,
          "utf8"
        ).toString("hex")}`
      )
    })

    it("returns the stored UID when present for a mailbox", async () => {
      const automationId = "auto-valid"
      const mailbox = "alerts"
      const tryGet = jest.fn().mockResolvedValue({ lastSeenUid: 42 })
      getWorkspaceDBMock.mockReturnValueOnce({ tryGet })

      const result = await getLastSeenUid(automationId, mailbox)

      expect(result).toBe(42)
      expect(tryGet).toHaveBeenCalledWith(
        `metadata_${MetadataType.AUTOMATION_EMAIL_STATE}_${automationId}:${Buffer.from(
          mailbox,
          "utf8"
        ).toString("hex")}`
      )
    })
  })

  describe("setLastSeenUid", () => {
    it("persists mailbox-specific state via updateEntityMetadata", async () => {
      const automationId = "auto-update"
      const mailbox = "dom"
      updateEntityMetadataMock.mockResolvedValue({}) // allow chaining

      await setLastSeenUid(automationId, mailbox, 99)

      expect(updateEntityMetadataMock).toHaveBeenCalledWith(
        MetadataType.AUTOMATION_EMAIL_STATE,
        `${automationId}:${Buffer.from(mailbox, "utf8").toString("hex")}`,
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
