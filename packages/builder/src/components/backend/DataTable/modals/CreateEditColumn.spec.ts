import { cleanup, render, screen } from "@testing-library/svelte"
import { FieldType, SourceName, TableSourceType } from "@budibase/types"
import type { Datasource, Table } from "@budibase/types"
import { readable } from "svelte/store"
import { afterEach, describe, expect, it, vi } from "vitest"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import { datasources, tables } from "@/stores/builder"
import CreateEditColumn from "./CreateEditColumn.svelte"

vi.mock("@budibase/bbui", () => ({
  Helpers: { uuid: () => "test-session" },
  AbsTooltip: MockSlot,
  Button: MockSlot,
  DatePicker: MockSlot,
  Icon: MockSlot,
  Input: MockInput,
  Label: MockSlot,
  Layout: MockSlot,
  Modal: MockSlot,
  Multiselect: MockSlot,
  notifications: { success: vi.fn(), error: vi.fn() },
  ProgressCircle: MockSlot,
  Select: MockSelect,
  Toggle: MockSlot,
  TooltipPosition: {},
  TooltipType: {},
}))
vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  return {
    datasources: writable({ list: [] }),
    tables: writable({ selected: undefined, list: [] }),
  }
})
vi.mock("@/helpers/utils", () => ({
  buildAutoColumn: vi.fn(),
  getAutoColumnInformation: () => ({}),
}))
vi.mock("@/dataBinding", () => ({ getUserBindings: () => [] }))
vi.mock("@/components/backend/DataTable/formula", () => ({
  getBindings: () => [],
}))
vi.mock("@/components/common/ConfirmDialog.svelte", () => ({
  default: MockSlot,
}))
vi.mock("@/components/common/AIFieldConfiguration.svelte", () => ({
  default: MockSlot,
}))
vi.mock("@/components/common/bindings/ModalBindableInput.svelte", () => ({
  default: MockSlot,
}))
vi.mock("@/components/common/RelationshipSelector.svelte", () => ({
  default: MockSlot,
}))
vi.mock("@/components/common/bindings/ServerBindingPanel.svelte", () => ({
  default: MockSlot,
}))
vi.mock("./JSONSchemaModal.svelte", () => ({ default: MockSlot }))
vi.mock("./OptionsEditor.svelte", () => ({ default: MockSlot }))

const renderColumn = (source: SourceName) => {
  const datasource: Datasource = {
    _id: "datasource_test",
    type: "datasource_plus",
    source,
  }
  const table: Table = {
    _id: "table_test",
    type: "table",
    name: "documents",
    sourceId: datasource._id!,
    sourceType: TableSourceType.EXTERNAL,
    sql: true,
    primaryDisplay: "name",
    schema: { name: { name: "name", type: FieldType.STRING } },
  }
  datasources.update(state => ({ ...state, list: [datasource] }))
  tables.update(state => ({ ...state, selected: table, list: [table] }))
  return render(CreateEditColumn, {
    context: new Map([["grid", { dispatch: vi.fn(), rows: readable([]) }]]),
  })
}

describe("SQL create-column type options", () => {
  afterEach(cleanup)

  it("offers JSON for Postgres", () => {
    renderColumn(SourceName.POSTGRES)
    expect(screen.getByRole("option", { name: "JSON" })).toBeInTheDocument()
  })

  it.each([
    SourceName.MYSQL,
    SourceName.SQL_SERVER,
    SourceName.ORACLE,
    SourceName.SNOWFLAKE,
  ])("does not offer JSON for %s", source => {
    renderColumn(source)
    expect(screen.getByRole("option", { name: "Text" })).toBeInTheDocument()
    expect(
      screen.queryByRole("option", { name: "JSON" })
    ).not.toBeInTheDocument()
  })
})
