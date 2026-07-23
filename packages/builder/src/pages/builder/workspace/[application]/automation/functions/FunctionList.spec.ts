import { fireEvent, render, screen } from "@testing-library/svelte"
import type { UIFunction } from "@/stores/builder/functions"
import { describe, expect, it, vi } from "vitest"
import FunctionList from "./FunctionList.svelte"

const makeFunction = (overrides: Partial<UIFunction> = {}): UIFunction => ({
  _id: "fn_one",
  _rev: "1-one",
  appId: "app_dev_one",
  name: "Customer lookup",
  source: "",
  capabilities: [],
  readiness: "ready",
  deploymentState: "published",
  createdAt: "2026-07-23T12:00:00.000Z",
  updatedAt: "2026-07-23T12:00:00.000Z",
  ...overrides,
})

describe("FunctionList", () => {
  it("shows loading, error, and retry states", async () => {
    const onRetry = vi.fn()
    const view = render(FunctionList, {
      loading: true,
      canManage: true,
      onRetry,
    })
    expect(screen.getByTestId("functions-loading-state")).toBeInTheDocument()

    await view.rerender({
      loading: false,
      error: "Runner unavailable",
      canManage: true,
      onRetry,
    })
    expect(screen.getByText("Runner unavailable")).toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "Retry" }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it("shows an actionable empty state for authors", async () => {
    const onCreate = vi.fn()
    render(FunctionList, {
      functions: [],
      canManage: true,
      onCreate,
    })

    expect(screen.getByTestId("functions-empty-state")).toBeInTheDocument()
    await fireEvent.click(screen.getByRole("button", { name: "New Function" }))
    expect(onCreate).toHaveBeenCalled()
  })

  it("hides authoring actions without permission", () => {
    render(FunctionList, {
      functions: [makeFunction()],
      canManage: false,
    })

    expect(screen.getByTestId("functions-permission-state")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "New Function" })
    ).not.toBeInTheDocument()
  })

  it("renders readiness separately from deployment state", () => {
    render(FunctionList, {
      canManage: true,
      functions: [
        makeFunction({
          readiness: "build_required",
          deploymentState: "unpublished_changes",
          capabilities: [
            {
              capabilityId: "cap_one",
              queryId: "query_one",
              datasourceAlias: "CRM",
              queryAlias: "find",
              parameterNames: [],
            },
          ],
        }),
      ],
    })

    expect(screen.getByText("Build required")).toBeInTheDocument()
    expect(screen.getByText("Unpublished changes")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })
})
