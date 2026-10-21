import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import type { ProjectResponse } from "@budibase/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => {
  const createStore = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    return {
      subscribe(subscriber: (value: T) => void) {
        subscriber(value)
        subscribers.add(subscriber)
        return () => subscribers.delete(subscriber)
      },
      set(next: T) {
        value = next
        subscribers.forEach(subscriber => subscriber(value))
      },
    }
  }
  const projects = createStore<ProjectResponse[]>([])
  return {
    createStore,
    projects,
    fetchProjects: vi.fn(),
    updateProject: vi.fn(),
    goto: vi.fn(),
  }
})

vi.mock("@roxi/routify", () => ({
  goto: mocks.createStore(mocks.goto),
  url: mocks.createStore((route: string) => route),
}))

vi.mock("@/stores/builder", () => ({
  workspaceStore: mocks.createStore({
    appId: "app_dev_test",
    name: "Team workspace",
  }),
  automationStore: mocks.createStore({ automations: [] }),
  contextMenuStore: {},
  datasources: mocks.createStore({ list: [] }),
  tables: mocks.createStore({ list: [] }),
  workspaceAppStore: mocks.createStore({
    workspaceApps: [
      {
        _id: "app_1",
        name: "Customer portal",
        projectIds: ["project_operations"],
        publishStatus: { state: "published" },
      },
    ],
  }),
  workspaceFavouriteStore: { lookup: mocks.createStore({}) },
}))

vi.mock("@/stores/portal", () => ({
  auth: mocks.createStore({ user: { _id: "user_builder" } }),
  featureFlags: mocks.createStore({ PROJECTS: true }),
  licensing: mocks.createStore({ isEnterprisePlan: true, isFreePlan: false }),
  agentsStore: Object.assign(mocks.createStore({ agents: [] }), {
    fetchAgents: vi.fn(),
  }),
  workspacesStore: mocks.createStore({ apps: [] }),
  projectsStore: Object.assign(mocks.projects, {
    fetch: mocks.fetchProjects,
    hasFetched: () => true,
    updateProject: mocks.updateProject,
  }),
}))

vi.mock("@/stores/bb", () => ({
  bb: mocks.createStore({ settings: { open: false } }),
}))

vi.mock("@budibase/shared-core", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/shared-core")>()
  return {
    ...actual,
    sdk: {
      ...actual.sdk,
      users: {
        ...actual.sdk.users,
        hasBuilderPermissions: () => true,
        canCreateApps: () => true,
      },
    },
  }
})

vi.mock("@/helpers/urls", () => ({ buildLiveUrl: vi.fn() }))
vi.mock(
  "@/components/common/ConfirmDialog.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/components/automation/AutomationPanel/DuplicateAutomationModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/pages/builder/workspace/[workspaceId]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/pages/builder/workspace/[workspaceId]/agent/AgentModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/components/automation/AutomationPanel/CreateAutomationModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/components/automation/Shared/CreateWebhookModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/components/projects/AssignProjectModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "@/components/backend/TableNavigator/modals/CreateTableModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "../_components/UpdateAgentModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/CreateProjectModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/ExportProjectModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/ImportProjectModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/ImportProjectResultModal.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/HomeMetrics.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)

import WorkspaceHome from "./index.svelte"

const project: ProjectResponse = {
  _id: "project_operations",
  _rev: "1-original",
  name: "Operations",
  readme: "# Project setup\nInstructions for the team.",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("workspace home project notes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.projects.set([project])
    mocks.fetchProjects.mockResolvedValue([project])
    const modalContainer = document.createElement("div")
    modalContainer.className = "modal-container"
    document.body.appendChild(modalContainer)
    history.replaceState(
      {},
      "",
      "/builder/workspace/app_dev_test/home?project=project_operations&type=automation&q=missing&sort=name&order=asc"
    )
  })

  afterEach(() => {
    document.querySelectorAll(".modal-container").forEach(node => node.remove())
    history.replaceState({}, "", "/")
  })

  it("keeps notes visible with no matching resources and restores filters and scroll after reading", async () => {
    const { container } = render(WorkspaceHome)
    await screen.findByRole("heading", { name: "Project setup" })
    expect(screen.getByPlaceholderText("Search")).toHaveValue("missing")
    const home = container.querySelector<HTMLDivElement>(".workspace-home")!
    home.scrollTop = 275
    const homeUrl = window.location.search

    await fireEvent.click(
      screen.getByRole("button", { name: "Read project notes" })
    )
    expect(screen.queryByPlaceholderText("Search")).toBeNull()
    expect(
      screen.getByRole("heading", { name: "Project setup" })
    ).toBeInTheDocument()
    await fireEvent.click(
      screen.getByRole("button", { name: "Back to resources" })
    )

    expect(screen.getByPlaceholderText("Search")).toHaveValue("missing")
    expect(window.location.search).toBe(homeUrl)
    expect(home.scrollTop).toBe(275)
    expect(screen.getByRole("button", { name: "Operations" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("returns to resources when changing projects and hides the guide for All projects", async () => {
    render(WorkspaceHome)
    await screen.findByRole("button", { name: "Read project notes" })
    await fireEvent.click(
      screen.getByRole("button", { name: "Read project notes" })
    )
    await fireEvent.click(screen.getByRole("button", { name: "All projects" }))
    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "Project notes" })).toBeNull()
    )
    expect(
      screen.queryByRole("button", { name: "Back to resources" })
    ).toBeNull()
    expect(screen.getByPlaceholderText("Search")).toHaveValue("missing")
  })
})
