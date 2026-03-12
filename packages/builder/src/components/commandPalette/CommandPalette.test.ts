import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  maliciousName: "<img src=x onerror=alert(document.domain)>",
  goto: vi.fn(),
  hide: vi.fn(),
  publishAppChanges: vi.fn(),
  setFlag: vi.fn(),
  settings: vi.fn(),
  showPreview: vi.fn(),
  themeUpdate: vi.fn(),
}))

vi.mock("svelte", async importOriginal => {
  const actual = await importOriginal<typeof import("svelte")>()

  return {
    ...actual,
    getContext: vi.fn(() => ({ hide: mocks.hide })),
  }
})

vi.mock("@/api", () => ({
  API: {
    publishAppChanges: mocks.publishAppChanges,
  },
}))

vi.mock("@/stores/bb", () => ({
  bb: {
    settings: mocks.settings,
  },
}))

vi.mock("@/stores/portal", async () => {
  const { writable } = await import("svelte/store")
  const featureFlagsStore = writable({
    DEBUG_UI: true,
    TEST_FLAG: false,
  })

  return {
    themeStore: {
      update: mocks.themeUpdate,
    },
    featureFlags: {
      subscribe: featureFlagsStore.subscribe,
      setFlag: mocks.setFlag,
    },
  }
})

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")

  return {
    automationStore: writable({ automations: [] }),
    previewStore: {
      showPreview: mocks.showPreview,
    },
    sortedScreens: writable([]),
    appStore: writable({
      appId: "app_1",
      url: "/test-app",
    }),
    datasources: writable({ list: [] }),
    queries: writable({ list: [] }),
    tables: writable({
      list: [{ _id: "ta_1", name: mocks.maliciousName }],
    }),
    views: writable({ list: [] }),
    viewsV2: writable({ list: [] }),
  }
})

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")

  return {
    goto: writable(mocks.goto),
    isActive: writable(() => true),
    params: writable({ application: "app_1" }),
  }
})

import CommandPalette from "./CommandPalette.svelte"

describe("CommandPalette", () => {
  it("renders entity names as text instead of html", () => {
    const { container } = render(CommandPalette)

    const escapedName = screen.getByText(mocks.maliciousName)

    expect(escapedName).toBeInTheDocument()
    expect(container.querySelector(".name img[src='x']")).toBeNull()
    expect(escapedName.closest(".name")?.innerHTML).toContain("&lt;img")
  })

  it("renders feature flag labels with inline code styling", () => {
    const { container } = render(CommandPalette)

    expect(screen.getByText("Enable")).toBeInTheDocument()
    expect(container.querySelector(".name code")).toHaveTextContent("TEST_FLAG")
  })
})
