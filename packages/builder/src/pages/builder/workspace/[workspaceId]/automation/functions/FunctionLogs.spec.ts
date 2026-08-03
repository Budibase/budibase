import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import type {
  FetchFunctionRunsResponse,
  FunctionRunSummary,
  FunctionRunSummaryStatus,
} from "@budibase/types"
import { FunctionErrorCode } from "@budibase/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FunctionLogs from "./FunctionLogs.svelte"

const api = vi.hoisted(() => ({
  getFunctionRuns: vi.fn(),
  getFunctionRun: vi.fn(),
}))

vi.mock("@/api", () => ({ API: api }))

const makeRun = (
  status: FunctionRunSummaryStatus,
  overrides: Partial<FunctionRunSummary> = {}
): FunctionRunSummary => ({
  _id: `function_run_${status}`,
  runId: `run_${status}`,
  functionId: "fn_one",
  functionName: "Customer lookup",
  sourceHash: `hash_${status}`,
  environment: "development",
  status,
  invocation: {
    type: "automation",
    automationId: "automation_one",
    stepId: "step_one",
  },
  startedAt: "2026-07-23T12:00:00.000Z",
  ...(status === "running"
    ? {}
    : {
        finishedAt: "2026-07-23T12:00:01.500Z",
        durationMs: 1500,
      }),
  queryCount: 2,
  ...overrides,
})

const runsResponse = (
  runs: FunctionRunSummary[],
  overrides: Partial<FetchFunctionRunsResponse> = {}
): FetchFunctionRunsResponse => ({
  runs,
  hasMore: false,
  ...overrides,
})

describe("FunctionLogs", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.className = "spectrum"
    api.getFunctionRun.mockImplementation(
      async (_functionId: string, runId: string) => ({
        run: makeRun("success", { runId }),
      })
    )
  })

  it("renders every status and labels both environments", async () => {
    api.getFunctionRuns.mockResolvedValue(
      runsResponse([
        makeRun("running"),
        makeRun("success", { environment: "published" }),
        makeRun("error"),
        makeRun("stopped", { environment: "published" }),
      ])
    )

    const view = render(FunctionLogs, { functionId: "fn_one" })

    await screen.findByText("Running")
    expect(screen.getByText("Success")).toBeInTheDocument()
    expect(screen.getByText("Error")).toBeInTheDocument()
    expect(screen.getByText("Stopped")).toBeInTheDocument()
    expect(screen.getAllByText("Development")).toHaveLength(2)
    expect(screen.getAllByText("Published")).toHaveLength(2)
    expect(screen.getByText("—")).toBeInTheDocument()
    expect(screen.getAllByText("1.5 s")).toHaveLength(3)

    expect(
      view.container.querySelector('tr[data-status="success"]')
    ).toHaveAttribute("data-environment", "published")
    expect(
      view.container.querySelector('tr[data-status="error"]')
    ).toHaveAttribute("data-environment", "development")
  })

  it("appends bookmark pages without changing merged API order", async () => {
    api.getFunctionRuns
      .mockResolvedValueOnce(
        runsResponse(
          [
            makeRun("success", {
              runId: "newest",
              environment: "development",
            }),
            makeRun("success", {
              runId: "middle",
              environment: "published",
            }),
          ],
          { hasMore: true, nextBookmark: "page_two" }
        )
      )
      .mockResolvedValueOnce(
        runsResponse([
          makeRun("error", {
            runId: "oldest",
            environment: "development",
          }),
        ])
      )

    const view = render(FunctionLogs, { functionId: "fn_one" })
    await screen.findByRole("button", { name: "Load more" })
    await fireEvent.click(screen.getByRole("button", { name: "Load more" }))

    await waitFor(() => {
      expect(view.container.querySelectorAll("tbody tr")).toHaveLength(3)
    })
    const rows = Array.from(view.container.querySelectorAll("tbody tr"))
    expect(rows.map(row => row.getAttribute("data-environment"))).toEqual([
      "development",
      "published",
      "development",
    ])
    expect(api.getFunctionRuns).toHaveBeenNthCalledWith(2, "fn_one", {
      bookmark: "page_two",
      limit: 20,
    })
  })

  it("shows a loading state", () => {
    api.getFunctionRuns.mockReturnValue(new Promise(() => {}))

    render(FunctionLogs, { functionId: "fn_one" })

    expect(screen.getByTestId("function-logs-loading")).toBeInTheDocument()
  })

  it("shows an empty state", async () => {
    api.getFunctionRuns.mockResolvedValue(runsResponse([]))

    render(FunctionLogs, { functionId: "fn_one" })

    expect(await screen.findByTestId("function-logs-empty")).toHaveTextContent(
      "No Function runs yet"
    )
  })

  it("shows an error state and retries", async () => {
    api.getFunctionRuns
      .mockRejectedValueOnce(new Error("History unavailable"))
      .mockResolvedValueOnce(runsResponse([makeRun("success")]))

    render(FunctionLogs, { functionId: "fn_one" })

    const errorState = await screen.findByTestId("function-logs-error")
    expect(errorState).toHaveTextContent("History unavailable")
    await fireEvent.click(
      within(errorState).getByRole("button", { name: "Retry" })
    )
    expect(await screen.findByText("Success")).toBeInTheDocument()
  })

  it("renders only contracted sanitized run details", async () => {
    const boundedMessage = "x".repeat(512)
    const failedRun = makeRun("error", {
      error: {
        code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
        message: boundedMessage,
      },
    })
    api.getFunctionRuns.mockResolvedValue(runsResponse([failedRun]))
    api.getFunctionRun.mockResolvedValue({
      run: {
        ...failedRun,
        inputs: { secretInput: "do-not-render" },
        output: { secretOutput: "do-not-render" },
        stack: "host-stack-do-not-render",
        logs: [{ message: "user-message-do-not-render" }],
      },
    })

    render(FunctionLogs, { functionId: "fn_one" })
    await fireEvent.click(
      await screen.findByRole("button", { name: "View details" })
    )

    const detail = await screen.findByRole("complementary", {
      name: "Function run details",
    })
    expect(detail).toHaveTextContent("Automation")
    expect(detail).toHaveTextContent("automation_one")
    expect(detail).toHaveTextContent("step_one")
    expect(detail).toHaveTextContent("hash_error")
    expect(detail).toHaveTextContent("FUNCTION_QUERY_DENIED")
    expect(detail).toHaveTextContent(boundedMessage)
    expect(detail).not.toHaveTextContent("do-not-render")
    expect(detail).not.toHaveTextContent("host-stack-do-not-render")
    expect(detail).not.toHaveTextContent("user-message-do-not-render")
  })
})
