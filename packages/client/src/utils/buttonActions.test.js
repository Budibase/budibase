import { beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"

const mockDownload = vi.fn()
const mockGetSelection = vi.fn()

vi.mock("downloadjs", () => ({
  default: mockDownload,
}))

vi.mock("@/stores", () => ({
  routeStore: writable({}),
  builderStore: writable({ inBuilder: false }),
  confirmationStore: { actions: {} },
  authStore: { actions: {} },
  stateStore: writable({}),
  notificationStore: { actions: { error: vi.fn() } },
  dataSourceStore: { actions: {} },
  uploadStore: { actions: {} },
  rowSelectionStore: {
    actions: {
      getSelection: mockGetSelection,
    },
  },
  sidePanelStore: { actions: {} },
  modalStore: { actions: {} },
}))

vi.mock("@/api", () => ({
  API: {
    exportRows: vi.fn(),
  },
}))

vi.mock("@/constants", () => ({
  ActionTypes: {},
  PeekMessages: {},
}))

vi.mock("./enrichDataBinding", () => ({
  enrichDataBindings: action => action,
}))

vi.mock("@budibase/bbui", () => ({
  Helpers: {
    deepSet: vi.fn(),
  },
}))

vi.mock("@budibase/frontend-core", () => ({
  downloadStream: vi.fn(),
}))

const exportQueryRows = async ({ format, fileName }) => {
  const { enrichButtonActions } = await import("./buttonActions.js")
  const exportData = enrichButtonActions(
    [
      {
        "##eventHandlerType": "Export Data",
        parameters: {
          tableComponentId: "query-table",
          rows: [{ firstName: "John", lastName: "Connor" }],
          type: format,
          columns: [{ name: "firstName" }, { name: "lastName" }],
          delimiter: ",",
          customHeaders: {
            firstName: "First name",
            lastName: "Last name",
          },
          fileName,
        },
      },
    ],
    {}
  )

  await exportData()

  return mockDownload.mock.calls[0][0].text()
}

describe("Export Data action", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mockGetSelection.mockReturnValue(undefined)
  })

  it.each([
    ["csv", "First name,Last name\nJohn,Connor"],
    [
      "json",
      JSON.stringify(
        [{ "First name": "John", "Last name": "Connor" }],
        null,
        2
      ),
    ],
  ])(
    "exports query rows with custom %s labels",
    async (format, expectedData) => {
      await expect(exportQueryRows({ format })).resolves.toBe(expectedData)
    }
  )

  it("uses a custom CSV file name", async () => {
    await exportQueryRows({ format: "csv", fileName: "customer-export" })

    expect(mockDownload).toHaveBeenLastCalledWith(
      expect.any(Blob),
      "customer-export.csv"
    )
  })

  it("replaces a custom file name extension with the selected format", async () => {
    await exportQueryRows({ format: "json", fileName: "customer-export.csv" })

    expect(mockDownload).toHaveBeenLastCalledWith(
      expect.any(Blob),
      "customer-export.json"
    )
  })

  it("falls back to the generated filename when the CSV file name is blank", async () => {
    await exportQueryRows({ format: "csv", fileName: "   " })

    expect(mockDownload).toHaveBeenLastCalledWith(
      expect.any(Blob),
      "query-table.csv"
    )
  })

  it("uses a custom JSON file name", async () => {
    await exportQueryRows({ format: "json", fileName: "customer-export" })

    expect(mockDownload).toHaveBeenLastCalledWith(
      expect.any(Blob),
      "customer-export.json"
    )
  })
})
