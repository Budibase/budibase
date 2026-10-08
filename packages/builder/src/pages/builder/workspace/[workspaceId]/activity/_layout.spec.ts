import { fireEvent, render, screen } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ActivityLayout from "./_layout.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    goto: vi.fn(),
    activePath: "./requests",
    featureFlags: writable({ AI_AGENT_ACTIVITY: true }),
  }
})

vi.mock("@roxi/routify", async () => {
  const { getContext } = await import("svelte")
  const { writable } = await import("svelte/store")

  return {
    goto: {
      subscribe: (run: (value: typeof mocks.goto) => void) => {
        getContext("routifyupdatepage")
        run(mocks.goto)
        return () => {}
      },
    },
    isActive: writable((path: string) => path === mocks.activePath),
  }
})

vi.mock("@/stores/portal", () => ({
  featureFlags: mocks.featureFlags,
}))

describe("Activity layout", () => {
  beforeEach(() => {
    mocks.goto.mockReset()
    mocks.activePath = "./requests"
    mocks.featureFlags.set({ AI_AGENT_ACTIVITY: true })
  })

  it("renders the Requests and Actions tabs, marking the active route", () => {
    mocks.activePath = "./actions"

    render(ActivityLayout)

    expect(screen.getByRole("button", { name: "Requests" })).not.toHaveClass(
      "active"
    )
    const actionsTab = screen.getByRole("button", { name: "Actions" })
    expect(actionsTab).toHaveClass("active")
    expect(actionsTab).toHaveAttribute("aria-current", "page")
  })

  it("navigates between tabs", async () => {
    render(ActivityLayout)

    await fireEvent.click(screen.getByRole("button", { name: "Actions" }))
    await fireEvent.click(screen.getByRole("button", { name: "Requests" }))

    expect(mocks.goto.mock.calls).toEqual([["./actions"], ["./requests"]])
  })

  it("redirects home and renders nothing when activity is disabled", () => {
    mocks.featureFlags.set({ AI_AGENT_ACTIVITY: false })

    render(ActivityLayout)

    expect(mocks.goto).toHaveBeenCalledWith("../home")
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
  })
})
