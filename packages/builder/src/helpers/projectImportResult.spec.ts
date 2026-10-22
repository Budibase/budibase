import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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
  beforeEach(() => sessionStorage.clear())
  afterEach(() => vi.restoreAllMocks())

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
    "only lets the matching workspace and user consume the summary",
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
      ).toEqual(response)
    }
  )

  it("preserves the handoff through a reload before destination navigation completes", async () => {
    saveProjectImportResult({
      workspaceId: "app_dev_destination",
      userId: "us_builder",
      response,
    })
    vi.resetModules()
    const reloaded = await import("./projectImportResult")

    expect(
      reloaded.takeProjectImportResult({
        workspaceId: "app_dev_destination",
        userId: "us_builder",
      })
    ).toEqual(response)
    expect(sessionStorage.length).toBe(0)
  })

  it("prefers the current handoff if storage cannot overwrite an older summary", () => {
    saveProjectImportResult({
      workspaceId: "app_dev_destination",
      userId: "us_builder",
      response,
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable")
    })
    const latest = {
      ...response,
      project: { ...response.project, name: "Latest import" },
    }
    saveProjectImportResult({
      workspaceId: "app_dev_destination",
      userId: "us_builder",
      response: latest,
    })
    expect(
      takeProjectImportResult({
        workspaceId: "app_dev_destination",
        userId: "us_builder",
      })
    ).toEqual(latest)
  })

  it.each([
    { workspaceId: "app_dev_other", userId: "us_builder" },
    { workspaceId: "app_dev_destination", userId: "us_other" },
  ])(
    "retains the fallback after a nonmatching lookup without storage %#",
    destination => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("storage unavailable")
      })
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
      ).toEqual(response)
    }
  )

  it.each([
    { project: null },
    { ...response, requirements: [null] },
    { ...response, unsupportedContent: [null] },
    { ...response, dataImport: {} },
    {
      ...response,
      requirements: [{ ...response.requirements[0], type: "unsupported" }],
    },
  ])("discards an invalid stored handoff %#", async invalid => {
    sessionStorage.setItem(
      "budibase:project-import:us_builder:app_dev_destination",
      JSON.stringify(invalid)
    )
    vi.resetModules()
    const reloaded = await import("./projectImportResult")
    expect(
      reloaded.takeProjectImportResult({
        workspaceId: "app_dev_destination",
        userId: "us_builder",
      })
    ).toBeUndefined()
    expect(sessionStorage.length).toBe(0)
  })
})
