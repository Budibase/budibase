import { ResourceType, ToolExecutionPrincipal } from "@budibase/types"
import { encodeJSBinding } from "@budibase/string-templates"
import {
  createBindingSearchTarget,
  createSearchTarget,
  createToolSearchTarget,
  findResourceSearchTargets,
} from "./references"

const queryResource = {
  id: "query_orders",
  name: "Get orders",
  type: ResourceType.QUERY,
}

describe("resource references", () => {
  it("finds structured agent operation tool references", () => {
    const target = createToolSearchTarget({
      resource: queryResource,
      toolName: "rest_sales_get_orders",
    })
    const resource = {
      operations: [
        {
          enabledTools: [
            {
              toolName: "rest_sales_get_orders",
              executionPrincipal: ToolExecutionPrincipal.REQUESTER,
            },
          ],
        },
      ],
    }

    expect(findResourceSearchTargets({ resource, targets: [target] })).toEqual([
      target,
    ])
  })

  it("does not match readable binding prefixes", () => {
    const shorterTarget = createBindingSearchTarget({
      resource: { ...queryResource, id: "query_get" },
      binding: "api.sales.get",
    })
    const ordersTarget = createBindingSearchTarget({
      resource: queryResource,
      binding: "api.sales.getOrders",
    })

    expect(
      findResourceSearchTargets({
        resource: { prompt: "Use {{ api.sales.getOrders }}" },
        targets: [shorterTarget, ordersTarget],
      })
    ).toEqual([ordersTarget])
  })

  it("matches readable bindings with field access", () => {
    const target = createBindingSearchTarget({
      resource: queryResource,
      binding: "api.sales.getOrders",
    })

    expect(
      findResourceSearchTargets({
        resource: { prompt: "Use {{ api.sales.getOrders.rows }}" },
        targets: [target],
      })
    ).toEqual([target])
  })

  it("prefers the most specific hierarchical readable binding", () => {
    const ordersTarget = createBindingSearchTarget({
      resource: { ...queryResource, id: "query_all_orders" },
      binding: "api.orders",
    })
    const monthlyOrdersTarget = createBindingSearchTarget({
      resource: queryResource,
      binding: "api.orders.by_month",
    })

    expect(
      findResourceSearchTargets({
        resource: { prompt: "Use {{ api.orders.by_month.rows }}" },
        targets: [ordersTarget, monthlyOrdersTarget],
      })
    ).toEqual([monthlyOrdersTarget])
  })

  it("keeps separate hierarchical readable binding matches", () => {
    const ordersTarget = createBindingSearchTarget({
      resource: { ...queryResource, id: "query_all_orders" },
      binding: "api.orders",
    })
    const monthlyOrdersTarget = createBindingSearchTarget({
      resource: queryResource,
      binding: "api.orders.by_month",
    })

    expect(
      findResourceSearchTargets({
        resource: {
          prompt:
            "Use {{ api.orders.rows }} and {{ api.orders.by_month.rows }}",
        },
        targets: [ordersTarget, monthlyOrdersTarget],
      })
    ).toEqual([ordersTarget, monthlyOrdersTarget])
  })

  it("matches resource references inside JavaScript bindings", () => {
    const target = createBindingSearchTarget({
      resource: queryResource,
      binding: "api.sales.getOrders",
    })

    expect(
      findResourceSearchTargets({
        resource: {
          prompt: encodeJSBinding(
            'return $("api.sales.getOrders.rows").length'
          ),
        },
        targets: [target],
      })
    ).toEqual([target])
  })

  it("matches bindings used as object keys", () => {
    const bindingTarget = createBindingSearchTarget({
      resource: queryResource,
      binding: "api.sales.getOrders",
    })

    expect(
      findResourceSearchTargets({
        resource: {
          [`{{ ${bindingTarget.idToSearch}.rows }}`]: "binding key",
        },
        targets: [bindingTarget],
      })
    ).toEqual([bindingTarget])
  })

  it("matches resource ids used as object keys", () => {
    const target = {
      ...queryResource,
      idToSearch: queryResource.id,
    }

    expect(
      findResourceSearchTargets({
        resource: { [queryResource.id]: "id key" },
        targets: [target],
      })
    ).toEqual([target])
  })

  it("does not match resource ids used as free-form text", () => {
    const target = createSearchTarget(queryResource)

    expect(
      findResourceSearchTargets({
        resource: { description: queryResource.id },
        targets: [target],
      })
    ).toEqual([])
  })

  it.each([
    { queryId: queryResource.id },
    { props: { dependencies: [queryResource.id] } },
  ])("matches resource ids in structured reference fields: %j", resource => {
    const target = createSearchTarget(queryResource)

    expect(
      findResourceSearchTargets({
        resource,
        targets: [target],
      })
    ).toEqual([target])
  })
})
