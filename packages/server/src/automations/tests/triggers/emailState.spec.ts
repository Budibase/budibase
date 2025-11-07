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
import {
  deleteAutomationMailboxState,
  getLastSeenUid,
  setLastSeenUid,
} from "../../email/state"
import { updateEntityMetadata } from "../../../utilities"
import { UNICODE_MAX } from "../../../db/utils"

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
      const existing = { someField: "value", _rev: "2-def" }
      expect(updater(existing)).toEqual({
        someField: "value",
        _rev: "2-def",
        lastSeenUid: 99,
      })
    })
  })

  describe("deleteAutomationMailboxState", () => {
    it("removes all mailbox state docs for an automation", async () => {
      const automationId = "auto-clean"
      const allDocs = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "metadata_automationEmailState_auto-clean:abcd",
            value: { _rev: "1-a" },
          },
          {
            id: "metadata_automationEmailState_auto-clean:efgh",
            value: { _rev: "1-b" },
          },
        ],
      })
      const bulkDocs = jest.fn().mockResolvedValue(undefined)
      getWorkspaceDBMock.mockReturnValueOnce({ allDocs, bulkDocs })

      await deleteAutomationMailboxState(automationId)

      expect(allDocs).toHaveBeenCalledWith({
        startkey: `metadata_${MetadataType.AUTOMATION_EMAIL_STATE}_${automationId}:`,
        endkey: `metadata_${MetadataType.AUTOMATION_EMAIL_STATE}_${automationId}:${UNICODE_MAX}`,
        include_docs: false,
      })
      expect(bulkDocs).toHaveBeenCalledWith([
        {
          _id: "metadata_automationEmailState_auto-clean:abcd",
          _rev: "1-a",
          _deleted: true,
        },
        {
          _id: "metadata_automationEmailState_auto-clean:efgh",
          _rev: "1-b",
          _deleted: true,
        },
      ])
    })

    it("is a no-op when no state docs exist", async () => {
      const automationId = "auto-clean-empty"
      const allDocs = jest.fn().mockResolvedValue({ rows: [] })
      const bulkDocs = jest.fn()
      getWorkspaceDBMock.mockReturnValueOnce({ allDocs, bulkDocs })

      await deleteAutomationMailboxState(automationId)

      expect(allDocs).toHaveBeenCalled()
      expect(bulkDocs).not.toHaveBeenCalled()
    })
  })
})
