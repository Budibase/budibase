import { fireEvent, render, screen, within } from "@testing-library/svelte"
import { Helpers } from "@budibase/bbui"
import type {
  FunctionQueryCapability,
  FunctionQueryCatalogEntry,
} from "@budibase/types"
import { SourceName } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FunctionQueryEditor from "./FunctionQueryEditor.svelte"

const catalog: FunctionQueryCatalogEntry[] = [
  {
    queryId: "query_customer",
    queryName: "Find renamed customer",
    datasourceId: "datasource_crm",
    datasourceName: "Renamed CRM",
    source: SourceName.POSTGRES,
    kind: "data",
    parameters: [{ name: "customerId" }],
  },
  {
    queryId: "query_event",
    queryName: "Send event",
    datasourceId: "datasource_events",
    datasourceName: "Events API",
    source: SourceName.REST,
    kind: "api",
    parameters: [{ name: "event" }],
  },
]

const capability: FunctionQueryCapability = {
  capabilityId: "cap_customer",
  queryId: "query_customer",
  datasourceAlias: "crm",
  queryAlias: "findCustomer",
  parameterNames: ["customerId"],
}

describe("FunctionQueryEditor", () => {
  beforeEach(() => {
    document.body.className = "spectrum"
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("shows current display names without changing stored aliases", async () => {
    render(FunctionQueryEditor, {
      capabilities: [capability],
      catalog,
    })

    expect(screen.getByText("Find renamed customer")).toBeInTheDocument()
    expect(screen.getByText("Renamed CRM")).toBeInTheDocument()
    await fireEvent.click(
      within(screen.getByTestId("linked-query-query_customer")).getByRole(
        "button",
        { expanded: false }
      )
    )
    expect(
      screen.getByText("await queries.crm.findCustomer()")
    ).toBeInTheDocument()
    expect(screen.queryByText("Parameters")).not.toBeInTheDocument()
  })

  it("copies the displayed query call", async () => {
    const copyToClipboard = vi
      .spyOn(Helpers, "copyToClipboard")
      .mockResolvedValue(undefined)
    render(FunctionQueryEditor, {
      capabilities: [capability],
      catalog,
    })

    await fireEvent.click(
      within(screen.getByTestId("linked-query-query_customer")).getByRole(
        "button",
        { expanded: false }
      )
    )
    await fireEvent.click(screen.getByRole("button", { name: /Copy/ }))

    expect(copyToClipboard).toHaveBeenCalledWith(
      "await queries.crm.findCustomer()"
    )
  })

  it("selects Data and API Explorer queries and saves only explicit links", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionQueryEditor, {
      catalog,
      onSave,
    })

    await fireEvent.click(screen.getByRole("button", { name: /Add query/ }))
    await fireEvent.click(
      screen.getByRole("menuitem", { name: /Find renamed customer/ })
    )
    await fireEvent.click(screen.getByRole("button", { name: /Add query/ }))
    await fireEvent.click(screen.getByRole("menuitem", { name: /Send event/ }))
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onSave).toHaveBeenCalledWith([
      {
        queryId: "query_customer",
        datasourceAlias: "renamedCRM",
        queryAlias: "findRenamedCustomer",
      },
      {
        queryId: "query_event",
        datasourceAlias: "eventsAPI",
        queryAlias: "sendEvent",
      },
    ])
  })

  it("reports unsaved query configuration changes", async () => {
    const onDirtyChange = vi.fn()
    render(FunctionQueryEditor, {
      catalog,
      onDirtyChange,
    })

    expect(onDirtyChange).toHaveBeenLastCalledWith(false)
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
    await fireEvent.click(screen.getByRole("button", { name: /Add query/ }))
    await fireEvent.click(
      screen.getByRole("menuitem", { name: /Find renamed customer/ })
    )

    expect(onDirtyChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled()
    await fireEvent.click(
      screen.getByRole("button", { name: "Remove Find renamed customer" })
    )
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
  })

  it("removes links, including saved queries that are now missing", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionQueryEditor, {
      capabilities: [
        {
          ...capability,
          queryId: "query_deleted",
          parameterNames: ["lastKnownId"],
        },
      ],
      catalog,
      onSave,
    })

    const missing = screen.getByTestId("linked-query-query_deleted")
    expect(within(missing).getByText("Missing query")).toBeInTheDocument()
    await fireEvent.click(
      within(missing).getByRole("button", { expanded: false })
    )

    await fireEvent.click(
      within(missing).getByRole("button", { name: "Remove missing query" })
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onSave).toHaveBeenCalledWith([])
  })

  it("blocks saving other link changes until a missing query is removed", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const view = render(FunctionQueryEditor, {
      capabilities: [
        capability,
        {
          ...capability,
          capabilityId: "cap_deleted",
          queryId: "query_deleted",
          queryAlias: "deleted",
        },
      ],
      catalog,
      onSave,
    })

    await fireEvent.click(
      within(screen.getByTestId("linked-query-query_customer")).getByRole(
        "button",
        { expanded: false }
      )
    )
    await fireEvent.input(view.container.querySelector("input")!, {
      target: { value: "customerData" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Remove missing query links before saving"
    )
    expect(onSave).not.toHaveBeenCalled()

    await fireEvent.click(
      within(screen.getByTestId("linked-query-query_deleted")).getByRole(
        "button",
        { name: "Remove missing query" }
      )
    )
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onSave).toHaveBeenCalledWith([
      {
        queryId: "query_customer",
        datasourceAlias: "customerData",
        queryAlias: "findCustomer",
      },
    ])
  })

  it("prevents invalid aliases with an actionable error", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const view = render(FunctionQueryEditor, {
      capabilities: [capability],
      catalog,
      onSave,
    })

    await fireEvent.click(
      within(screen.getByTestId("linked-query-query_customer")).getByRole(
        "button",
        { expanded: false }
      )
    )
    const inputs = view.container.querySelectorAll("input")
    await fireEvent.input(inputs[0], {
      target: { value: "invalid alias" },
    })
    await fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(
      screen.getByText("Use a JavaScript identifier, for example customerData.")
    ).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it("shows catalog failures and retries", async () => {
    const onRetry = vi.fn()
    render(FunctionQueryEditor, {
      capabilities: [capability],
      catalogError: "Unable to fetch saved queries",
      onRetry,
    })

    expect(screen.getByTestId("query-catalog-error")).toHaveTextContent(
      "Unable to fetch saved queries"
    )
    expect(screen.getByText("Query details unavailable")).toBeInTheDocument()
    expect(screen.queryByText("Missing query")).not.toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Retry" }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it("highlights declaration parameter changes", async () => {
    render(FunctionQueryEditor, {
      capabilities: [
        {
          ...capability,
          parameterNames: ["oldParameter"],
        },
      ],
      catalog,
    })

    await fireEvent.click(
      within(screen.getByTestId("linked-query-query_customer")).getByRole(
        "button",
        { expanded: false }
      )
    )
    expect(screen.getByText(/Query parameters changed/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveClass(
      "is-disabled"
    )
  })
})
