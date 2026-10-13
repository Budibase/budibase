import { describe, expect, it } from "vitest"
import type { ImportProjectResponse } from "@budibase/types"
import {
  saveProjectImportResult,
  takeProjectImportResult,
} from "./projectImportResult"

const response: ImportProjectResponse = {
  project: {
    _id: "project_imported",
    _rev: "1-project",
    name: "Support",
    createdAt: "2026-10-07T12:00:00.000Z",
    updatedAt: "2026-10-07T12:00:00.000Z",
  },
  resources: {},
  requirements: [
    {
      type: "agent_ai_config",
      resourceId: "agent_imported",
      name: "Support agent",
      reason: "Choose an AI model.",
    },
  ],
  unsupportedContent: [],
  dataImport: { tables: 2, rows: 3, relationships: 1, attachments: 1 },
}

describe("Project import result handoff", () => {
  it("carries the native setup summary and data counts once into its destination", () => {
    saveProjectImportResult({
      workspaceId: "app_dev_destination",
      userId: "us_builder",
      response,
    })

    expect(
      takeProjectImportResult({
        workspaceId: "app_dev_destination",
        userId: "us_builder",
      })
    ).toEqual(response)
    expect(
      takeProjectImportResult({
        workspaceId: "app_dev_destination",
        userId: "us_builder",
      })
    ).toBeUndefined()
  })

  it.each([
    { workspaceId: "app_dev_other", userId: "us_builder" },
    { workspaceId: "app_dev_destination", userId: "us_other" },
  ])(
    "discards a stale summary for a different workspace or user",
    destination => {
      saveProjectImportResult({
        workspaceId: "app_dev_destination",
        userId: "us_builder",
        response,
      })

      expect(takeProjectImportResult(destination)).toBeUndefined()
      expect(
        takeProjectImportResult({
          workspaceId: "app_dev_destination",
          userId: "us_builder",
        })
      ).toBeUndefined()
    }
  )
})
