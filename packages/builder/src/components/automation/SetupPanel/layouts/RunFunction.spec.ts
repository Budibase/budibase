import { fireEvent, render, screen } from "@testing-library/svelte"
import {
  AutomationActionStepId,
  AutomationStepType,
  type AutomationStep,
  type FunctionResponse,
} from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const mocks = vi.hoisted(() => {
  const store = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    return {
      set: (next: T) => {
        value = next
        subscribers.forEach(run => run(value))
      },
      subscribe: (run: (value: T) => void) => {
        subscribers.add(run)
        run(value)
        return () => subscribers.delete(run)
      },
    }
  }

  return {
    functionStore: Object.assign(
      store<{
        functions: FunctionResponse[]
        loading: boolean
        error: string | undefined
      }>({
        functions: [],
        loading: false,
        error: undefined,
      }),
      { fetch: vi.fn() }
    ),
    requestUpdate: vi.fn(),
    inputData: {
      functionId: undefined as string | undefined,
      inputs: undefined,
    },
  }
})

vi.mock("@/stores/builder", () => ({
  automationStore: {
    actions: {
      getInputData: () => mocks.inputData,
      requestUpdate: mocks.requestUpdate,
    },
  },
}))

vi.mock("@/stores/builder/functions", () => ({
  functionStore: mocks.functionStore,
}))

vi.mock("../FunctionInputsEditor.svelte", () => ({
  default: MockSlot,
}))

import RunFunction from "./RunFunction.svelte"

const makeFunction = (
  overrides: Partial<FunctionResponse> = {}
): FunctionResponse => ({
  _id: "fn_ready",
  _rev: "1-ready",
  appId: "app_dev_test",
  name: "Ready Function",
  source: "",
  capabilities: [],
  readiness: "ready",
  createdAt: "2026-08-03T00:00:00.000Z",
  updatedAt: "2026-08-03T00:00:00.000Z",
  ...overrides,
})

const block: AutomationStep = {
  id: "step-1",
  stepId: AutomationActionStepId.EXECUTE_FUNCTION,
  type: AutomationStepType.ACTION,
  name: "Run Function",
  tagline: "Run a Function",
  icon: "function",
  description: "Run a Function in this automation",
  inputs: {
    functionId: "",
    inputs: { value: "{}" },
  },
  schema: {
    inputs: { required: ["functionId", "inputs"], properties: {} },
    outputs: { required: ["success", "status"], properties: {} },
  },
}

describe("RunFunction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.className = "spectrum"
    mocks.inputData.functionId = undefined
    mocks.functionStore.set({
      functions: [],
      loading: false,
      error: undefined,
    })
  })

  it("loads Functions and saves the selected Function ID", async () => {
    const readyFunction = makeFunction()
    mocks.functionStore.set({
      functions: [readyFunction],
      loading: false,
      error: undefined,
    })
    render(RunFunction, { block })

    expect(mocks.functionStore.fetch).toHaveBeenCalledOnce()
    await fireEvent.click(
      screen.getByRole("button", { name: /Select a Function/i })
    )
    await fireEvent.click(
      screen.getByRole("option", {
        name: /Ready Function · Ready/i,
        hidden: true,
      })
    )

    expect(mocks.requestUpdate).toHaveBeenCalledWith(
      { functionId: readyFunction._id, inputs: {} },
      block
    )
  })

  it.each([
    [
      "build_required" as const,
      "This Function must be built before the automation can run it.",
    ],
    [
      "build_failed" as const,
      "The latest Function build failed. Fix and rebuild it before running this automation.",
    ],
  ])("shows the %s Function state", (readiness, message) => {
    const fn = makeFunction({ readiness })
    mocks.inputData.functionId = fn._id
    mocks.functionStore.set({
      functions: [fn],
      loading: false,
      error: undefined,
    })

    render(RunFunction, { block })

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it("handles a deleted or missing Function selection", () => {
    mocks.inputData.functionId = "fn_deleted"

    render(RunFunction, { block })

    expect(
      screen.getByText(
        "This Function was deleted or is unavailable. Select another Function."
      )
    ).toBeInTheDocument()
  })

  it("shows the fetch error without reporting the selected Function as missing", () => {
    mocks.inputData.functionId = "fn_saved"
    mocks.functionStore.set({
      functions: [],
      loading: false,
      error: "Unable to load Functions",
    })

    render(RunFunction, { block })

    expect(screen.getByText("Unable to load Functions")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
    expect(
      screen.queryByText(
        "This Function was deleted or is unavailable. Select another Function."
      )
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        "Create and build a Function before configuring this step."
      )
    ).not.toBeInTheDocument()
  })
})
