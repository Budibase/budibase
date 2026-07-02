import { render } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import PortalWorkspacesPage from "./workspaces.svelte"

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
}))

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")

  return {
    redirect: writable(mocks.redirect),
  }
})

describe("builder portal workspaces redirect", () => {
  beforeEach(() => {
    mocks.redirect.mockReset()
  })

  it("redirects legacy portal workspaces route to apps", () => {
    render(PortalWorkspacesPage)

    expect(mocks.redirect).toHaveBeenCalledWith("../apps")
  })
})
