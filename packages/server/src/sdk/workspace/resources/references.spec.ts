import { ResourceType, ToolExecutionPrincipal } from "@budibase/types"
import {
  createBindingSearchTarget,
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
})
