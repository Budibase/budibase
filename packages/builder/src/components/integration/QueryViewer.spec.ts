import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import { writable } from "svelte/store"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { notifications } from "@budibase/bbui"
import { SourceName, type Query } from "@budibase/types"
import { queries } from "@/stores/builder"
import QueryViewer from "./QueryViewer.svelte"

const beforeNavigation = vi.hoisted(() =>
  vi.fn<(_guard: (_event: { type: string; url: string }) => boolean) => void>()
)

vi.mock("@roxi/routify", () => ({
  goto: writable(vi.fn()),
  beforeUrlChange: writable(beforeNavigation),
}))

vi.mock("@/stores/builder", () => ({
  datasources: writable({
    list: [{ _id: "datasource_1", source: "MONGODB" }],
  }),
  integrations: writable({
    MONGODB: { query: { read: { type: "json", displayName: "Read" } } },
  }),
  queries: { ...writable({ list: [] }), preview: vi.fn(), save: vi.fn() },
  tables: writable({ list: [] }),
}))

vi.mock("./ConnectedQueryUsage.svelte", async () => ({
  default: (await import("@/test/mocks/MockComponent.svelte")).default,
}))
vi.mock("./AccessLevelSelect.svelte", async () => ({
  default: (await import("@/test/mocks/MockComponent.svelte")).default,
}))
vi.mock("./index.svelte", async () => ({
  default: (await import("@/test/mocks/MockComponent.svelte")).default,
}))
vi.mock("@/components/common/CodeMirrorEditor.svelte", async () => ({
  default: (await import("@/test/mocks/MockComponent.svelte")).default,
}))
vi.mock("@/components/backend/DataTable/Table.svelte", async () => ({
  default: (await import("@/test/mocks/MockComponent.svelte")).default,
}))

const savedQuery: Query = {
  _id: "query_1",
  datasourceId: "datasource_1",
  name: "Read customers",
  queryVerb: "read",
  readable: true,
  parameters: [],
  fields: { json: "{}" },
  transformer: null,
  schema: { name: { type: "string" } },
  nestedSchemaFields: { address: { city: { type: "string" } } },
}

const renameField = async () => {
  const input = screen.getByDisplayValue("name")
  await fireEvent.input(input, { target: { value: "customerName" } })
  await fireEvent.blur(input)
}

describe("QueryViewer saved schema", () => {
  afterEach(() => vi.restoreAllMocks())

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.className = "spectrum"
    if (!document.querySelector(".modal-container")) {
      const modalContainer = document.createElement("div")
      modalContainer.className = "modal-container"
      document.body.appendChild(modalContainer)
    }
    vi.mocked(queries.save).mockResolvedValue(savedQuery)
    vi.mocked(queries.preview).mockResolvedValue({
      rows: [{ name: "Alice" }],
      schema: savedQuery.schema,
      nestedSchemaFields: savedQuery.nestedSchemaFields || {},
      info: {},
      extra: {},
    })
  })

  it("starts saved queries collapsed with their schema available without running", () => {
    render(QueryViewer, { query: savedQuery })

    expect(
      screen.getByRole("button", { name: "Expand query results" })
    ).toBeVisible()
    expect(screen.getByDisplayValue("name")).not.toBeVisible()
    expect(queries.preview).not.toHaveBeenCalled()
  })

  it("edits and saves an existing schema without running, retaining edits across collapse and expansion", async () => {
    render(QueryViewer, { query: savedQuery })
    await fireEvent.click(
      screen.getByRole("button", { name: "Expand query results" })
    )
    await renameField()
    await fireEvent.click(screen.getByLabelText("RailRightClose"))
    await fireEvent.click(
      screen.getByRole("button", { name: "Expand query results" })
    )
    await fireEvent.click(screen.getByRole("button", { name: /Save$/ }))

    await waitFor(() =>
      expect(queries.save).toHaveBeenCalledWith(
        savedQuery.datasourceId,
        expect.objectContaining({
          schema: { customerName: { type: "string" } },
          nestedSchemaFields: savedQuery.nestedSchemaFields,
        }),
        SourceName.MONGODB
      )
    )
    expect(screen.getByDisplayValue("customerName")).toBeVisible()
    expect(queries.preview).not.toHaveBeenCalled()
    expect(savedQuery.schema).toEqual({ name: { type: "string" } })
  })

  it("requires a new query to run before its schema can be edited or saved", () => {
    render(QueryViewer, {
      query: { ...savedQuery, _id: undefined, schema: {} },
    })

    expect(screen.queryByRole("button", { name: "Schema" })).toBeNull()
    expect(screen.getByRole("button", { name: /Save$/ })).toBeDisabled()
    expect(queries.preview).not.toHaveBeenCalled()
  })

  it("reopens query results after a run without executing the query again", async () => {
    render(QueryViewer, {
      query: { ...savedQuery, _id: undefined, schema: {} },
    })
    await fireEvent.click(screen.getByRole("button", { name: /Run query$/ }))
    await screen.findByDisplayValue(/"name": "Alice"/)
    await fireEvent.click(screen.getByLabelText("RailRightClose"))
    await fireEvent.click(
      screen.getByRole("button", { name: "Expand query results" })
    )

    expect(screen.getByDisplayValue(/"name": "Alice"/)).toBeVisible()
    expect(queries.preview).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: /Save$/ })).toBeEnabled()
  })

  it.each(["an error", "no rows"])(
    "does not expose the results panel when a new query returns %s",
    async outcome => {
      const notification = vi.spyOn(
        notifications,
        outcome === "an error" ? "error" : "info"
      )
      if (outcome === "an error") {
        vi.mocked(queries.preview).mockRejectedValue(new Error("Query failed"))
      } else {
        vi.mocked(queries.preview).mockResolvedValue({
          rows: [],
          schema: {},
          nestedSchemaFields: {},
          info: {},
          extra: {},
        })
      }
      render(QueryViewer, {
        query: { ...savedQuery, _id: undefined, schema: {} },
      })
      await fireEvent.click(screen.getByRole("button", { name: /Run query$/ }))

      await waitFor(() => {
        expect(notification).toHaveBeenCalledOnce()
        expect(screen.queryByRole("button", { name: "Schema" })).toBeNull()
        expect(
          screen.queryByRole("button", { name: "Expand query results" })
        ).toBeNull()
        expect(screen.getByRole("button", { name: /Save$/ })).toBeDisabled()
        expect(screen.getByRole("button", { name: /Run query$/ })).toBeEnabled()
      })
    }
  )

  it("saves schema edits from the navigation prompt without running the query", async () => {
    render(QueryViewer, { query: savedQuery })
    await fireEvent.click(
      screen.getByRole("button", { name: "Expand query results" })
    )
    await renameField()
    const guard = beforeNavigation.mock.calls[0][0]
    guard({ type: "pushstate", url: "/another-query" })
    await fireEvent.click(
      await screen.findByRole("button", { name: "Save and Continue" })
    )

    await waitFor(() => expect(queries.save).toHaveBeenCalledOnce())
    expect(queries.preview).not.toHaveBeenCalled()
  })

  it("allows the last saved schema field to be removed without running", async () => {
    render(QueryViewer, { query: savedQuery })
    await fireEvent.click(
      screen.getByRole("button", { name: "Expand query results" })
    )
    await fireEvent.click(screen.getByLabelText("x"))
    await fireEvent.click(screen.getByRole("button", { name: /Save$/ }))

    await waitFor(() =>
      expect(queries.save).toHaveBeenCalledWith(
        savedQuery.datasourceId,
        expect.objectContaining({ schema: {} }),
        SourceName.MONGODB
      )
    )
    expect(queries.preview).not.toHaveBeenCalled()
  })
})
