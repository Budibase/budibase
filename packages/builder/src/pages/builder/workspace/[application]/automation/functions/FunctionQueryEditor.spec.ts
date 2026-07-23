import { fireEvent, render, screen, within } from "@testing-library/svelte"
import type {
  FunctionQueryCapability,
  FunctionQueryCatalogEntry,
} from "@budibase/types"
import { SourceName } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FunctionQueryEditor from "./FunctionQueryEditor.svelte"

if (!Element.prototype.animate) {
  Element.prototype.animate = () =>
    Object.assign(Object.create(null), {
      onfinish: null,
      cancel: () => {},
      finished: Promise.resolve(),
    }) as Animation
}

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

  it("shows current display names without changing stored aliases", () => {
    render(FunctionQueryEditor, {
      capabilities: [capability],
      catalog,
    })

    expect(screen.getByText("Find renamed customer")).toBeInTheDocument()
    expect(screen.getByText("Renamed CRM")).toBeInTheDocument()
    expect(screen.getByText("queries.crm.findCustomer()")).toBeInTheDocument()
    expect(screen.getByText("customerId: string | null")).toBeInTheDocument()
  })

  it("selects Data and API Explorer queries and saves only explicit links", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(FunctionQueryEditor, {
      catalog,
      onSave,
    })

    await fireEvent.click(
      screen.getByRole("button", { name: /Link a Data query/i })
    )
    await fireEvent.click(
      screen.getByRole("option", {
        name: /Find renamed customer/i,
        hidden: true,
      })
    )
    await fireEvent.click(
      screen.getByRole("button", { name: /Link an API query/i })
    )
    await fireEvent.click(
      screen.getByRole("option", { name: /Send event/i, hidden: true })
    )
    await fireEvent.click(
      screen.getByRole("button", { name: "Save query links" })
    )

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
    expect(
      within(missing).getByText("lastKnownId: string | null")
    ).toBeInTheDocument()

    await fireEvent.click(
      within(missing).getByRole("button", { name: "Remove missing query" })
    )
    await fireEvent.click(
      screen.getByRole("button", { name: "Save query links" })
    )

    expect(onSave).toHaveBeenCalledWith([])
  })

  it("prevents invalid aliases with an actionable error", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const view = render(FunctionQueryEditor, {
      capabilities: [capability],
      catalog,
      onSave,
    })

    const inputs = view.container.querySelectorAll("input")
    await fireEvent.input(inputs[1], {
      target: { value: "invalid alias" },
    })
    await fireEvent.click(
      screen.getByRole("button", { name: "Save query links" })
    )

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

  it("highlights declaration parameter changes", () => {
    render(FunctionQueryEditor, {
      capabilities: [
        {
          ...capability,
          parameterNames: ["oldParameter"],
        },
      ],
      catalog,
    })

    expect(screen.getByText(/Query parameters changed/)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Save query links" })
    ).not.toHaveClass("is-disabled")
  })
})
