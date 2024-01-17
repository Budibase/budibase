import { it, expect, describe, vi } from "vitest"
import { render, screen } from "@testing-library/svelte"
import "@testing-library/jest-dom"

import ExportModal from "./ExportModal.svelte"
import { utils } from "@budibase/shared-core"

const labelLookup = utils.filterValueToLabel()

const rowText = filter => {
  let readableField = filter.field.split(":")[1]
  let rowLabel = labelLookup[filter.operator]
  let value = Array.isArray(filter.value)
    ? JSON.stringify(filter.value)
    : filter.value
  return `${readableField}${rowLabel}${value}`.trim()
}

const defaultFilters = [
  {
    onEmptyFilter: "all",
  },
]

vi.mock("svelte", async () => {
  return {
    getContext: () => {
      return {
        hide: vi.fn(),
        cancel: vi.fn(),
      }
    },
    createEventDispatcher: vi.fn(),
    onDestroy: vi.fn(),
  }
})

vi.mock("api", async () => {
  return {
    API: {
      exportView: vi.fn(),
      exportRows: vi.fn(),
    },
  }
})

describe("Export Modal", () => {
  it("show default messaging with no export config specified", () => {
    render(ExportModal, {
      props: {},
    })

    expect(screen.getByTestId("export-all-rows")).toBeVisible()
    expect(screen.getByTestId("export-all-rows")).toHaveTextContent(
      "Exporting all rows"
    )

    expect(screen.queryByTestId("export-config-table")).toBe(null)
  })

  it("indicate that a filter is being applied to the export", () => {
    const propsCfg = {
      filters: [
        {
          id: "MOQkMx9p9",
          field: "1:Cost",
          operator: "rangeHigh",
          value: "100",
          valueType: "Value",
          type: "number",
          noValue: false,
        },
        ...defaultFilters,
      ],
    }

    render(ExportModal, {
      props: propsCfg,
    })

    expect(screen.getByTestId("filters-applied")).toBeVisible()
    expect(screen.getByTestId("filters-applied").textContent).toBe(
      "Filters applied"
    )

    const ele = screen.queryByTestId("export-config-table")
    expect(ele).toBeVisible()

    const rows = ele.getElementsByClassName("spectrum-Table-row")

    expect(rows.length).toBe(1)
    let rowTextContent = rowText(propsCfg.filters[0])

    //"CostLess than or equal to100"
    expect(rows[0].textContent?.trim()).toEqual(rowTextContent)
  })

  it("Show only selected row messaging if rows are supplied", () => {
    const propsCfg = {
      filters: [
        {
          id: "MOQkMx9p9",
          field: "1:Cost",
          operator: "rangeHigh",
          value: "100",
          valueType: "Value",
          type: "number",
          noValue: false,
        },
        ...defaultFilters,
      ],
      sorting: {
        sortColumn: "Cost",
        sortOrder: "descending",
      },
      selectedRows: [
        {
          _id: "ro_ta_bb_expenses_57d5f6fe1b6640d8bb22b15f5eae62cd",
        },
        {
          _id: "ro_ta_bb_expenses_99ce5760a53a430bab4349cd70335a07",
        },
      ],
    }

    render(ExportModal, {
      props: propsCfg,
    })

    expect(screen.queryByTestId("export-config-table")).toBeNull()
    expect(screen.queryByTestId("filters-applied")).toBeNull()

    expect(screen.queryByTestId("exporting-n-rows")).toBeVisible()
    expect(screen.queryByTestId("exporting-n-rows").textContent).toEqual(
      "2 rows will be exported"
    )
  })

  it("Show only the configured sort when no filters are specified", () => {
    const propsCfg = {
      filters: [...defaultFilters],
      sorting: {
        sortColumn: "Cost",
        sortOrder: "descending",
      },
    }
    render(ExportModal, {
      props: propsCfg,
    })

    expect(screen.queryByTestId("export-config-table")).toBeVisible()
    const ele = screen.queryByTestId("export-config-table")
    const rows = ele.getElementsByClassName("spectrum-Table-row")

    expect(rows.length).toBe(1)
    expect(rows[0].textContent?.trim()).toEqual(
      `${propsCfg.sorting.sortColumn}Order By${propsCfg.sorting.sortOrder}`
    )
  })

  it("Display all currently configured filters and applied sort", () => {
    const propsCfg = {
      filters: [
        {
          id: "MOQkMx9p9",
          field: "1:Cost",
          operator: "rangeHigh",
          value: "100",
          valueType: "Value",
          type: "number",
          noValue: false,
        },
        {
          id: "2ot-aB0gE",
          field: "2:Expense Tags",
          operator: "contains",
          value: ["Equipment", "Services"],
          valueType: "Value",
          type: "array",
          noValue: false,
        },
        ...defaultFilters,
      ],
      sorting: {
        sortColumn: "Payment Due",
        sortOrder: "ascending",
      },
    }

    render(ExportModal, {
      props: propsCfg,
    })

    const ele = screen.queryByTestId("export-config-table")
    expect(ele).toBeVisible()

    const rows = ele.getElementsByClassName("spectrum-Table-row")
    expect(rows.length).toBe(3)

    let rowTextContent1 = rowText(propsCfg.filters[0])
    expect(rows[0].textContent?.trim()).toEqual(rowTextContent1)

    let rowTextContent2 = rowText(propsCfg.filters[1])
    expect(rows[1].textContent?.trim()).toEqual(rowTextContent2)

    expect(rows[2].textContent?.trim()).toEqual(
      `${propsCfg.sorting.sortColumn}Order By${propsCfg.sorting.sortOrder}`
    )
  })

  it("show only the valid, configured download formats", () => {
    const propsCfg = {
      formats: ["badger", "json"],
    }

    render(ExportModal, {
      props: propsCfg,
    })

    let ele = screen.getByTestId("format-select")
    expect(ele).toBeVisible()

    let formatDisplay = ele.getElementsByTagName("button")[0]

    expect(formatDisplay.textContent.trim()).toBe("JSON")
  })

  it("Load the default format config when no explicit formats are configured", () => {
    render(ExportModal, {
      props: {},
    })

    let ele = screen.getByTestId("format-select")
    expect(ele).toBeVisible()

    let formatDisplay = ele.getElementsByTagName("button")[0]

    expect(formatDisplay.textContent.trim()).toBe("CSV")
  })
})
