import { render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it } from "vitest"
import FunctionRuntimeNotice from "./FunctionRuntimeNotice.svelte"

describe("FunctionRuntimeNotice", () => {
  beforeEach(() => {
    document.body.className = "spectrum"
  })

  it.each([
    ["healthy", "Runner healthy"],
    ["disabled", "Runner disabled"],
    ["unhealthy", "Runner unhealthy"],
    ["busy", "Runner busy"],
  ] as const)("renders the %s runner state independently", (status, label) => {
    render(FunctionRuntimeNotice, { status })

    expect(screen.getByTestId("function-runner-status")).toHaveAttribute(
      "data-status",
      status
    )
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("shows the trusted Function author boundary", () => {
    render(FunctionRuntimeNotice, { status: "healthy" })

    expect(screen.getByRole("note")).toHaveTextContent(
      "intended for trusted Function authors"
    )
    expect(screen.getByRole("note")).toHaveTextContent(
      "hardened external executor"
    )
  })
})
