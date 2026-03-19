import { render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AgentIndex from "./agent/index.svelte"
import AutomationIndex from "./automation/index.svelte"
import ChatIndex from "./chat/index.svelte"
import DesignIndex from "./design/index.svelte"
import WorkspaceIndex from "./index.svelte"

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
}))

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")

  return {
    redirect: writable(mocks.redirect),
  }
})

describe("workspace route redirects", () => {
  beforeEach(() => {
    mocks.redirect.mockReset()
    window.history.replaceState({}, "", "/")
  })

  it("redirects the workspace root to home", async () => {
    render(WorkspaceIndex)

    await waitFor(() => {
      expect(mocks.redirect).toHaveBeenCalledWith("./home")
    })
  })

  it("preserves query params when redirecting the workspace root", async () => {
    window.history.replaceState({}, "", "/?tab=recent")

    render(WorkspaceIndex)

    await waitFor(() => {
      expect(mocks.redirect).toHaveBeenCalledWith("./home?tab=recent")
    })
  })

  it("redirects the design landing page to the home app filter", () => {
    render(DesignIndex)

    expect(mocks.redirect).toHaveBeenCalledWith("../home?type=app")
  })

  it("redirects the automation landing page to the home automation filter", () => {
    render(AutomationIndex)

    expect(mocks.redirect).toHaveBeenCalledWith("../home?type=automation")
  })

  it("redirects the agent landing page to the home agent filter", () => {
    render(AgentIndex)

    expect(mocks.redirect).toHaveBeenCalledWith("../home?type=agent")
  })

  it("redirects the chat landing page to home", () => {
    render(ChatIndex)

    expect(mocks.redirect).toHaveBeenCalledWith("../home")
  })
})
