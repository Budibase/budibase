import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { tick } from "svelte"
import type { Row, ValidateTableImportResponse } from "@budibase/types"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import TableDataImportHarness from "@/test/mocks/TableDataImportHarness.svelte"
import { API } from "@/api"

vi.mock("@budibase/bbui", async importOriginal => {
  const { Dropzone } = await importOriginal<typeof import("@budibase/bbui")>()
  return {
    Dropzone,
    Icon: MockIcon,
    Label: MockBody,
    Layout: MockLayout,
    Select: MockSelect,
  }
})

vi.mock("@budibase/frontend-core", async () => {
  const { canBeDisplayColumn } = await import(
    "../../../../../frontend-core/src/utils/table"
  )
  return {
    Constants: {
      TypeIconMap: new Proxy(
        {},
        {
          get: () => "",
        }
      ),
    },
    canBeDisplayColumn,
  }
})

vi.mock("@/api", () => ({
  API: {
    validateNewTableImport: vi.fn(),
    csvToJson: vi.fn(),
  },
}))

import TableDataImport from "./TableDataImport.svelte"

describe("TableDataImport", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(API.csvToJson).mockResolvedValue([{ name: "Ada" }])
    vi.mocked(API.validateNewTableImport).mockResolvedValue({
      schemaValidation: { name: true },
      allValid: true,
      errors: {},
      invalidColumns: [],
    })
  })
  it("does not validate or re-enter updates when mounted without imported rows", () => {
    render(TableDataImport, {
      props: {
        rows: [],
        schema: {},
        allValid: true,
        displayColumn: null,
      },
    })

    expect(screen.getByText("Drag and drop your file")).toBeInTheDocument()
    expect(API.validateNewTableImport).not.toHaveBeenCalled()
  })

  it.each([
    {
      name: "people.csv",
      type: "text/csv",
      content: "name\nAda",
      csvCalls: [["name\nAda"]],
    },
    {
      name: "people.CSV",
      type: "application/vnd.ms-excel",
      content: "name\nAda",
      csvCalls: [["name\nAda"]],
    },
    {
      name: "people.json",
      type: "application/json",
      content: '[{"name":"Ada"}]',
      csvCalls: [],
    },
    {
      name: "people.JSON",
      type: "",
      content: '[{"name":"Ada"}]',
      csvCalls: [],
    },
  ])(
    "imports a dropped $name file with MIME type '$type'",
    async ({ name, type, content, csvCalls }) => {
      render(TableDataImport)
      await fireEvent.drop(screen.getByRole("region"), {
        dataTransfer: { files: [new File([content], name, { type })] },
      })

      expect(await screen.findByText("Success")).toBeInTheDocument()
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(vi.mocked(API.csvToJson).mock.calls).toEqual(csvCalls)
      expect(API.validateNewTableImport).toHaveBeenCalledWith(
        [{ name: "Ada" }],
        expect.objectContaining({
          name: expect.objectContaining({ name: "name" }),
        })
      )
    }
  )

  it("imports a CSV selected using the file picker", async () => {
    render(TableDataImport)
    await fireEvent.change(screen.getByLabelText("Click to select a file"), {
      target: {
        files: [new File(["name\nAda"], "people.csv", { type: "text/csv" })],
      },
    })

    expect(await screen.findByText("Success")).toBeInTheDocument()
    expect(screen.getByText("people.csv")).toBeInTheDocument()
    expect(API.csvToJson).toHaveBeenCalledExactlyOnceWith("name\nAda")
  })

  it("imports a JSON table export containing rows and a schema", async () => {
    render(TableDataImport)
    const schema = { name: { name: "name", type: "string" } }
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: {
        files: [
          new File(
            [JSON.stringify({ rows: [{ name: "Ada" }], schema })],
            "export.json",
            { type: "application/json" }
          ),
        ],
      },
    })

    expect(await screen.findByText("Success")).toBeInTheDocument()
    expect(API.validateNewTableImport).toHaveBeenCalledWith(
      [{ name: "Ada" }],
      schema
    )
  })

  it("allows removing an empty JSON file", async () => {
    const { container } = render(TableDataImport)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: {
        files: [new File(["[]"], "empty.json", { type: "application/json" })],
      },
    })
    await screen.findByText("empty.json")
    await waitFor(() =>
      expect(container.querySelector(".delete-button")).not.toBeNull()
    )
    await fireEvent.click(container.querySelector(".delete-button")!)

    expect(
      await screen.findByText("Drag and drop your file")
    ).toBeInTheDocument()
    expect(screen.queryByText("empty.json")).not.toBeInTheDocument()
  })

  it.each([
    { name: "image.png", type: "image/png" },
    { name: "people.txt", type: "text/csv" },
    { name: "people.csv.exe", type: "application/octet-stream" },
    { name: "csv", type: "text/csv" },
    { name: "CSV", type: "text/csv" },
    { name: "json", type: "application/json" },
    { name: "JSON", type: "application/json" },
    { name: "people.csv.", type: "text/csv" },
    { name: "people.json.", type: "application/json" },
  ])("rejects $name before importing", async ({ name, type }) => {
    render(TableDataImport)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: { files: [new File(["name\nAda"], name, { type })] },
    })

    expect(
      await screen.findByText("Only CSV and JSON files are supported.")
    ).toBeInTheDocument()
    expect(API.csvToJson).not.toHaveBeenCalled()
    expect(API.validateNewTableImport).not.toHaveBeenCalled()
    expect(screen.getByText("Drag and drop your file")).toBeInTheDocument()
  })

  it("rejects multiple dropped files", async () => {
    render(TableDataImport)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: {
        files: [
          new File(["name\nAda"], "one.csv"),
          new File(["name\nAda"], "two.csv"),
        ],
      },
    })

    expect(
      await screen.findByText("Choose one CSV or JSON file.")
    ).toBeInTheDocument()
    expect(API.validateNewTableImport).not.toHaveBeenCalled()
  })

  it.each([
    ["{invalid", "Cannot parse JSON. Check that the file contains valid JSON."],
    ["{}", "JSON must contain an array of rows."],
    ["null", "JSON must contain an array of rows."],
  ])("rejects invalid JSON %s and allows retrying", async (content, error) => {
    render(TableDataImport)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: {
        files: [
          new File([content], "invalid.json", { type: "application/json" }),
        ],
      },
    })
    await screen.findByText(error)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: {
        files: [
          new File(['[{"name":"Ada"}]'], "valid.json", {
            type: "application/json",
          }),
        ],
      },
    })

    expect(await screen.findByText("Success")).toBeInTheDocument()
    expect(screen.queryByText(error)).not.toBeInTheDocument()
  })

  it("preserves the 10MB import limit", async () => {
    render(TableDataImport)
    const file = new File(["name\nAda"], "large.csv", { type: "text/csv" })
    Object.defineProperty(file, "size", { value: 10_000_000 })
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: { files: [file] },
    })

    expect(
      await screen.findByText("Files must be smaller than 10MB.")
    ).toBeInTheDocument()
    expect(API.csvToJson).not.toHaveBeenCalled()
    expect(API.validateNewTableImport).not.toHaveBeenCalled()
  })

  it("clears the imported schema when the file is removed", async () => {
    const { container } = render(TableDataImportHarness)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: {
        files: [new File(["name\nAda"], "people.csv", { type: "text/csv" })],
      },
    })
    await screen.findByText("Success")
    await fireEvent.click(container.querySelector(".delete-button")!)

    await waitFor(() =>
      expect(screen.queryByText("Success")).not.toBeInTheDocument()
    )
    expect(screen.queryByText("people.csv")).not.toBeInTheDocument()
    expect(screen.getByText("Drag and drop your file")).toBeInTheDocument()
    expect(screen.getByTestId("bound-schema").textContent).toBe("{}")
    expect(screen.getByTestId("bound-rows").textContent).toBe("[]")
  })

  it("clears the selected display column when its file is removed", async () => {
    const { container } = render(TableDataImportHarness)
    await fireEvent.drop(screen.getByRole("region"), {
      dataTransfer: { files: [new File(["name\nAda"], "people.csv")] },
    })
    await screen.findByText("Success")
    await fireEvent.change(
      screen.getByRole("combobox", { name: "Display Column" }),
      {
        target: { value: "name" },
      }
    )
    await fireEvent.click(container.querySelector(".delete-button")!)

    await waitFor(() =>
      expect(screen.getByTestId("bound-display-column").textContent).toBe(
        "null"
      )
    )
    expect(screen.getByTestId("bound-schema").textContent).toBe("{}")
    expect(screen.getByTestId("bound-rows").textContent).toBe("[]")
    expect(screen.getByTestId("bound-all-valid").textContent).toBe("true")
  })

  it.each([
    {
      name: "unsupported file",
      files: [new File(["invalid"], "people.txt")],
      message: "Only CSV and JSON files are supported.",
    },
    {
      name: "malformed JSON",
      files: [new File(["{invalid"], "people.json")],
      message: "Cannot parse JSON. Check that the file contains valid JSON.",
    },
    {
      name: "multiple files",
      files: [
        new File(["name\nAda"], "one.csv"),
        new File(["name\nAda"], "two.csv"),
      ],
      message: "Choose one CSV or JSON file.",
    },
  ])(
    "clears a previous import when a replacement is rejected: $name",
    async ({ files, message }) => {
      render(TableDataImportHarness)
      const input = screen.getByLabelText("Click to select a file")
      await fireEvent.change(input, {
        target: { files: [new File(["name\nAda"], "people.csv")] },
      })
      await screen.findByText("Success")
      await fireEvent.change(
        screen.getByRole("combobox", { name: "Display Column" }),
        {
          target: { value: "name" },
        }
      )
      await fireEvent.change(input, { target: { files } })

      expect(await screen.findByText(message)).toBeInTheDocument()
      expect(screen.getByTestId("bound-schema").textContent).toBe("{}")
      expect(screen.getByTestId("bound-rows").textContent).toBe("[]")
      expect(screen.getByTestId("bound-display-column").textContent).toBe(
        "null"
      )
      expect(screen.getByTestId("bound-all-valid").textContent).toBe("false")
    }
  )

  it("invalidates the previous import while a replacement is being parsed", async () => {
    render(TableDataImportHarness)
    const input = screen.getByLabelText("Click to select a file")
    await fireEvent.change(input, {
      target: { files: [new File(["name\nAda"], "people.csv")] },
    })
    await screen.findByText("Success")
    const parsed = Promise.withResolvers<Row[]>()
    vi.mocked(API.csvToJson).mockReturnValueOnce(parsed.promise)
    await fireEvent.change(input, {
      target: { files: [new File(["name\nGrace"], "replacement.csv")] },
    })

    expect(screen.getByTestId("bound-rows").textContent).toBe("[]")
    expect(screen.getByTestId("bound-schema").textContent).toBe("{}")
    expect(screen.getByTestId("bound-display-column").textContent).toBe("null")
    expect(screen.getByTestId("bound-all-valid").textContent).toBe("false")

    parsed.resolve([{ name: "Grace" }])
    await waitFor(() =>
      expect(screen.getByTestId("bound-all-valid").textContent).toBe("true")
    )
    expect(screen.getByTestId("bound-rows").textContent).toBe(
      '[{"name":"Grace"}]'
    )
  })

  it("ignores a parsed file that finishes after a newer rejection", async () => {
    render(TableDataImportHarness)
    const input = screen.getByLabelText("Click to select a file")
    const parsed = Promise.withResolvers<Row[]>()
    vi.mocked(API.csvToJson).mockReturnValueOnce(parsed.promise)
    await fireEvent.change(input, {
      target: { files: [new File(["name\nAda"], "people.csv")] },
    })
    await waitFor(() => expect(API.csvToJson).toHaveBeenCalledWith("name\nAda"))
    await fireEvent.change(input, {
      target: { files: [new File(["invalid"], "invalid.txt")] },
    })
    await screen.findByText("Only CSV and JSON files are supported.")
    parsed.resolve([{ name: "Ada" }])
    await parsed.promise
    await tick()

    expect(screen.getByTestId("bound-rows").textContent).toBe("[]")
    expect(screen.getByTestId("bound-schema").textContent).toBe("{}")
    expect(screen.getByTestId("bound-all-valid").textContent).toBe("false")
    expect(
      screen.getByText("Only CSV and JSON files are supported.")
    ).toBeInTheDocument()
    expect(API.validateNewTableImport).not.toHaveBeenCalled()
  })

  it.each(["resolve", "reject"])(
    "ignores a validation response that %ss after a newer rejection",
    async completion => {
      render(TableDataImportHarness)
      const input = screen.getByLabelText("Click to select a file")
      const validation = Promise.withResolvers<ValidateTableImportResponse>()
      vi.mocked(API.validateNewTableImport).mockReturnValueOnce(
        validation.promise
      )
      await fireEvent.change(input, {
        target: { files: [new File(["name\nAda"], "people.csv")] },
      })
      await waitFor(() => expect(API.validateNewTableImport).toHaveBeenCalled())
      await fireEvent.change(input, {
        target: { files: [new File(["invalid"], "invalid.txt")] },
      })
      await screen.findByText("Only CSV and JSON files are supported.")
      if (completion === "resolve") {
        validation.resolve({
          schemaValidation: { name: true },
          allValid: true,
          errors: {},
          invalidColumns: [],
        })
      } else {
        validation.reject(new Error("Stale validation failure"))
      }
      await validation.promise.catch(() => {})
      await tick()

      expect(screen.getByTestId("bound-rows").textContent).toBe("[]")
      expect(screen.getByTestId("bound-schema").textContent).toBe("{}")
      expect(screen.getByTestId("bound-all-valid").textContent).toBe("false")
      expect(
        screen.getByText("Only CSV and JSON files are supported.")
      ).toBeInTheDocument()
      expect(
        screen.queryByText("Stale validation failure")
      ).not.toBeInTheDocument()
    }
  )
})
