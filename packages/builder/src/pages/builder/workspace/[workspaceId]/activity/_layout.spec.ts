import { fireEvent, render, screen } from "@testing-library/svelte"
import { tick } from "svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ActivityLayout from "./_layout.svelte"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    goto: vi.fn(),
    redirect: vi.fn(),
    activePath: "./requests",
    featureFlags: writable({ AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: true }),
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
    redirect: {
      subscribe: (run: (value: typeof mocks.redirect) => void) => {
        run(mocks.redirect)
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
    mocks.redirect.mockReset()
    mocks.activePath = "./requests"
    mocks.featureFlags.set({ AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: true })
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

  it.each([
    {
      flags: { AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: false },
      activePath: "./requests",
      expectedTabs: ["Requests"],
    },
    {
      flags: { AI_AGENT_ACTIVITY: false, PLATFORM_ACTIONS: true },
      activePath: "./actions",
      expectedTabs: ["Actions"],
    },
  ])(
    "only renders tabs enabled by $flags",
    ({ flags, activePath, expectedTabs }) => {
      mocks.featureFlags.set(flags)
      mocks.activePath = activePath

      render(ActivityLayout)

      expect(
        screen.getAllByRole("button").map(button => button.textContent?.trim())
      ).toEqual(expectedTabs)
      expect(mocks.goto).not.toHaveBeenCalled()
      expect(mocks.redirect).not.toHaveBeenCalled()
    }
  )

  it.each([
    {
      flags: { AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: false },
      activePath: "./actions",
      expectedRedirect: "./requests",
    },
    {
      flags: { AI_AGENT_ACTIVITY: false, PLATFORM_ACTIONS: true },
      activePath: "./requests",
      expectedRedirect: "./actions",
    },
  ])(
    "redirects $activePath to $expectedRedirect without rendering it",
    ({ flags, activePath, expectedRedirect }) => {
      mocks.featureFlags.set(flags)
      mocks.activePath = activePath

      render(ActivityLayout)

      expect(mocks.redirect).toHaveBeenCalledWith(expectedRedirect)
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    }
  )

  it("redirects away from Actions when its flag is disabled after mount", async () => {
    mocks.activePath = "./actions"
    render(ActivityLayout)

    mocks.featureFlags.set({ AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: false })
    await tick()

    expect(mocks.redirect).toHaveBeenCalledWith("./requests")
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("shows the Actions tab when its flag is enabled after mount", async () => {
    mocks.featureFlags.set({ AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: false })
    render(ActivityLayout)

    mocks.featureFlags.set({ AI_AGENT_ACTIVITY: true, PLATFORM_ACTIONS: true })
    await tick()

    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument()
  })

  it("redirects home when every activity flag is disabled after mount", async () => {
    render(ActivityLayout)

    mocks.featureFlags.set({
      AI_AGENT_ACTIVITY: false,
      PLATFORM_ACTIONS: false,
    })
    await tick()

    expect(mocks.goto).toHaveBeenCalledWith("../home")
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("redirects home and renders nothing when activity is disabled", () => {
    mocks.featureFlags.set({
      AI_AGENT_ACTIVITY: false,
      PLATFORM_ACTIONS: false,
    })

    render(ActivityLayout)

    expect(mocks.goto).toHaveBeenCalledWith("../home")
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
  })
})
