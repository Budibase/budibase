import { fireEvent, render, screen, within } from "@testing-library/svelte"
import type {
  ImportProjectResponse,
  PreviewProjectAssignmentRequest,
  PreviewProjectAssignmentResponse,
  ProjectResponse,
} from "@budibase/types"
import { ResourceType } from "@budibase/types"
import { tick } from "svelte"
import { get } from "svelte/store"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockCheckbox from "@/test/mocks/MockCheckbox.svelte"
import MockControllableModal from "@/test/mocks/MockControllableModal.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import { notifications } from "@budibase/bbui"
import { saveProjectImportResult } from "@/helpers/projectImportResult"

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
  const apps = [
    {
      _id: "workspace_app_operations",
      _rev: "1-operations",
      name: "Operations portal",
      projectIds: ["project_operations"],
      publishStatus: { state: "draft" },
    },
    {
      _id: "workspace_app_reporting",
      _rev: "2-reporting",
      name: "Reporting portal",
      projectIds: ["project_reporting"],
      publishStatus: { state: "draft" },
    },
  ]
  return {
    createStore,
    apps,
    projects: createStore<ProjectResponse[]>([]),
    workspace: createStore({ appId: "app_dev_test", name: "Team workspace" }),
    workspaceApps: createStore({ workspaceApps: apps }),
    ensureFetched: vi.fn().mockResolvedValue(undefined),
    fetchProjects: vi.fn(),
    hasFetched: vi.fn().mockReturnValue(true),
    fetchAgents: vi.fn().mockResolvedValue(undefined),
    refreshWorkspace: vi.fn().mockResolvedValue(true),
    previewAssignment:
      vi.fn<
        (
          request: PreviewProjectAssignmentRequest
        ) => Promise<PreviewProjectAssignmentResponse>
      >(),
    saveAssignment: vi.fn(),
    openContextMenu:
      vi.fn<
        (
          id: string,
          items: { name: string; callback: () => void }[],
          position: { x: number; y: number },
          onClose: () => void
        ) => void
      >(),
  }
})

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Button: MockButton,
  Checkbox: MockCheckbox,
  Icon: MockSlot,
  Modal: MockControllableModal,
  ModalContent: MockModalContent,
  Multiselect: MockSelect,
  ProgressCircle: MockSlot,
  AbsTooltip: MockSlot,
  Helpers: { getDateDisplayValue: () => "", uuid: () => "test-api-session" },
  Notification: MockSlot,
  keepOpen: Symbol("keepOpen"),
  notifications: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
}))

vi.mock("@roxi/routify", () => ({
  goto: mocks.createStore(vi.fn()),
  url: mocks.createStore((route: string) => route),
}))

vi.mock("@/stores/builder", () => ({
  workspaceStore: Object.assign(mocks.workspace, {
    refresh: mocks.refreshWorkspace,
  }),
  automationStore: mocks.createStore({ automations: [] }),
  contextMenuStore: { open: mocks.openContextMenu },
  datasources: mocks.createStore({ list: [] }),
  tables: mocks.createStore({ list: [] }),
  workspaceAppStore: mocks.workspaceApps,
  workspaceFavouriteStore: { lookup: mocks.createStore({}) },
}))

vi.mock("@/stores/portal", () => ({
  auth: mocks.createStore({ user: { _id: "user_builder" } }),
  enrichedApps: mocks.createStore([]),
  featureFlags: mocks.createStore({ PROJECTS: true }),
  licensing: mocks.createStore({ isEnterprisePlan: true }),
  agentsStore: Object.assign(mocks.createStore({ agents: [] }), {
    fetchAgents: mocks.fetchAgents,
  }),
  workspacesStore: mocks.createStore({ apps: [] }),
  projectsStore: Object.assign(mocks.projects, {
    fetch: mocks.fetchProjects,
    ensureFetched: mocks.ensureFetched,
    hasFetched: mocks.hasFetched,
    previewAssignment: mocks.previewAssignment,
  }),
}))

vi.mock("@/components/projects/assignments", () => ({
  saveProjectAssignment: mocks.saveAssignment,
}))
vi.mock("@/helpers/urls", () => ({ buildLiveUrl: vi.fn() }))
vi.mock("@/constants/backend", async () => {
  const { INTERNAL_TABLE_SOURCE_ID } = await import("@budibase/types")
  return { BUDIBASE_INTERNAL_DB_ID: INTERNAL_TABLE_SOURCE_ID }
})
vi.mock(
  "@/pages/builder/_components/FavouriteResourceButton.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
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
  "./_components/HomeMetrics.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/HomeControls.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/HomeCreateMenu.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/HomeHeaderActions.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/HomeProjectTabs.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)
vi.mock(
  "./_components/ProjectReadme.svelte",
  () => import("@/test/mocks/MockSlot.svelte")
)

import WorkspaceHome from "./index.svelte"

const dependency = {
  id: "automation_shared",
  name: "Shared notification",
  type: ResourceType.AUTOMATION,
}
const advancePreview = async () => {
  await vi.advanceTimersByTimeAsync(150)
  await tick()
}
const openContextMenu = async ({ name }: { name: string }) => {
  await fireEvent.contextMenu(
    screen.getByRole("button", { name: new RegExp(name) })
  )
}
const chooseAssignProject = async () => {
  const [, items] = mocks.openContextMenu.mock.lastCall!
  items.find(item => item.name === "Assign project")!.callback()
  await tick()
  await advancePreview()
}
const selectProject = async ({ name }: { name: string }) => {
  const projectSelect = screen.getByLabelText("Projects")
  for (const option of within(projectSelect).getAllByRole("option")) {
    const projectOption = option as HTMLOptionElement
    projectOption.selected = projectOption.text === name
  }
  await fireEvent.change(projectSelect)
  await advancePreview()
}

describe("workspace home project assignments", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    mocks.workspace.set({ appId: "app_dev_test", name: "Team workspace" })
    mocks.refreshWorkspace.mockResolvedValue(true)
    mocks.hasFetched.mockReturnValue(true)
    mocks.workspaceApps.set({ workspaceApps: mocks.apps })
    mocks.projects.set(
      ["operations", "reporting", "finance"].map(name => ({
        _id: `project_${name}`,
        _rev: "1-project",
        name: name.charAt(0).toUpperCase() + name.slice(1),
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      }))
    )
    mocks.fetchProjects.mockImplementation(async () => get(mocks.projects))
    mocks.ensureFetched.mockImplementation(async () => get(mocks.projects))
    mocks.saveAssignment.mockResolvedValue(undefined)
    mocks.previewAssignment.mockImplementation(async request => {
      const app = mocks.apps.find(app => app._id === request.resourceId)!
      return {
        resourceRev: app._rev,
        resourceProjectIds: app.projectIds,
        dependencies: [{ ...dependency, projectIdsToAdd: request.projectIds }],
        dependencyFingerprint: `preview-${app._id}`,
      }
    })
    history.replaceState({}, "", "/builder/workspace/app_dev_test/home")
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    history.replaceState({}, "", "/")
  })

  it("opens a setup deep link using the initial project request", async () => {
    mocks.projects.set([
      {
        _id: "project_operations",
        _rev: "1-project",
        name: "Operations",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        importSetup: {
          resources: {},
          requirements: [
            {
              type: "agent_ai_config",
              resourceId: "agent_1",
              name: "Support agent",
              reason: "Choose an AI model.",
            },
          ],
          unsupportedContent: [],
        },
      },
    ])
    history.replaceState(
      {},
      "",
      "/builder/workspace/app_dev_test/home?project=project_operations&setup=project_operations"
    )

    render(WorkspaceHome)

    await vi.waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Configure Support agent" })
      ).toBeInTheDocument()
    })
    expect(mocks.fetchProjects).toHaveBeenCalledExactlyOnceWith("app_dev_test")
    expect(window.location.search).toBe("?project=project_operations")
  })

  it("keeps the open assignment and its save target when another row's context menu opens", async () => {
    render(WorkspaceHome)
    await openContextMenu({ name: "Operations portal" })
    await chooseAssignProject()
    await selectProject({ name: "Finance" })
    await fireEvent.click(screen.getByLabelText(dependency.name))

    await openContextMenu({ name: "Reporting portal" })
    mocks.saveAssignment.mockRejectedValueOnce(new Error("Please try again"))
    await fireEvent.click(screen.getByRole("button", { name: "Save changes" }))

    expect(
      screen.getByText("Operations portal", { selector: ".resource-name" })
    ).toBeInTheDocument()
    expect(mocks.saveAssignment).toHaveBeenCalledWith({
      resourceId: "workspace_app_operations",
      selection: {
        resourceRev: "1-operations",
        projectIds: ["project_finance"],
        dependencyIds: [],
        dependencyFingerprint: "preview-workspace_app_operations",
      },
    })
  })

  it.each([
    { name: "Reporting portal", id: "reporting", revision: "2-reporting" },
    { name: "Operations portal", id: "operations", revision: "1-operations" },
  ])(
    "starts a fresh assignment when Assign project is chosen again for $name",
    async ({ name, id, revision }) => {
      render(WorkspaceHome)
      await openContextMenu({ name: "Operations portal" })
      await chooseAssignProject()
      await selectProject({ name: "Finance" })
      await fireEvent.click(screen.getByLabelText(dependency.name))
      mocks.saveAssignment.mockRejectedValueOnce({
        status: 409,
        message: "The assignment changed",
      })
      await fireEvent.click(
        screen.getByRole("button", { name: "Save changes" })
      )

      await openContextMenu({ name })
      await chooseAssignProject()
      await fireEvent.click(
        screen.getByRole("button", { name: "Save changes" })
      )

      expect(screen.queryByText("The assignment changed")).toBeNull()
      expect(mocks.saveAssignment).toHaveBeenLastCalledWith({
        resourceId: `workspace_app_${id}`,
        selection: {
          resourceRev: revision,
          projectIds: [`project_${id}`],
          dependencyIds: [dependency.id],
          dependencyFingerprint: `preview-workspace_app_${id}`,
        },
      })
    }
  )
})

describe("workspace home import completion", () => {
  const response: ImportProjectResponse = {
    project: {
      _id: "project_imported",
      _rev: "1-imported",
      name: "Imported project",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    resources: { [ResourceType.PROJECT]: ["project_imported"] },
    requirements: [
      {
        type: "agent_ai_config",
        resourceId: "agent_imported",
        name: "Imported agent",
        reason: "Choose an AI model.",
      },
    ],
    unsupportedContent: [],
  }

  const deferRefresh = () => {
    let resolve!: (applied: boolean) => void
    let reject!: (error: Error) => void
    const promise = new Promise<boolean>((res, rej) => {
      resolve = res
      reject = rej
    })
    mocks.refreshWorkspace.mockReturnValueOnce(promise)
    return { promise, resolve, reject }
  }

  const renderPendingImport = async () => {
    saveProjectImportResult({
      workspaceId: "app_dev_test",
      userId: "user_builder",
      response,
    })
    const rendered = render(WorkspaceHome)
    await tick()
    return rendered
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.workspace.set({ appId: "app_dev_test", name: "Team workspace" })
    mocks.workspaceApps.set({ workspaceApps: mocks.apps })
    mocks.projects.set([response.project])
    mocks.refreshWorkspace.mockReset().mockResolvedValue(true)
    mocks.hasFetched.mockReturnValue(true)
    mocks.fetchProjects.mockImplementation(async () => get(mocks.projects))
    mocks.ensureFetched.mockImplementation(async () => get(mocks.projects))
    history.replaceState({}, "", "/builder/workspace/app_dev_test/home")
  })

  afterEach(() => {
    sessionStorage.clear()
    history.replaceState({}, "", "/")
  })

  it("shows the imported project setup after refreshing the current workspace", async () => {
    await renderPendingImport()

    expect(
      screen.getByRole("button", { name: "Configure Imported agent" })
    ).toBeInTheDocument()
    expect(mocks.refreshWorkspace).toHaveBeenCalledOnce()
    expect(notifications.warning).not.toHaveBeenCalled()
  })

  it("keeps the imported project selected while loading the destination's projects", async () => {
    mocks.projects.set([
      {
        ...response.project,
        _id: "project_previous",
        name: "Previous project",
      },
    ])
    let resolveProjects!: (projects: ProjectResponse[]) => void
    const pendingProjects = new Promise<ProjectResponse[]>(resolve => {
      resolveProjects = resolve
    })
    mocks.fetchProjects.mockImplementationOnce(() => {
      mocks.hasFetched.mockReturnValue(false)
      mocks.projects.set([])
      return pendingProjects.then(projects => {
        mocks.hasFetched.mockReturnValue(true)
        mocks.projects.set(projects)
        return projects
      })
    })
    history.replaceState(
      {},
      "",
      "/builder/workspace/app_dev_test/home?project=project_imported"
    )

    await renderPendingImport()
    resolveProjects([response.project])
    await pendingProjects
    await tick()

    expect(new URL(window.location.href).searchParams.get("project")).toBe(
      response.project._id
    )
    expect(mocks.fetchProjects).toHaveBeenCalledExactlyOnceWith("app_dev_test")
  })

  it("keeps the import summary closed when the store skips an obsolete refresh", async () => {
    mocks.refreshWorkspace.mockResolvedValueOnce(false)

    await renderPendingImport()

    expect(
      screen.queryByRole("button", { name: "Configure Imported agent" })
    ).not.toBeInTheDocument()
    expect(mocks.refreshWorkspace).toHaveBeenCalledOnce()
    expect(notifications.warning).not.toHaveBeenCalled()
  })

  it("keeps an earlier import summary closed after switching workspace during refresh", async () => {
    const pending = deferRefresh()
    await renderPendingImport()

    mocks.workspace.set({ appId: "app_dev_other", name: "Other workspace" })
    pending.resolve(true)
    await pending.promise
    await tick()

    expect(
      screen.queryByRole("button", { name: "Configure Imported agent" })
    ).not.toBeInTheDocument()
    expect(notifications.warning).not.toHaveBeenCalled()
  })

  it("ignores an earlier import refresh failure after switching workspace", async () => {
    const pending = deferRefresh()
    await renderPendingImport()

    mocks.workspace.set({ appId: "app_dev_other", name: "Other workspace" })
    pending.reject(new Error("Refresh unavailable"))
    await pending.promise.catch(() => {})
    await tick()

    expect(
      screen.queryByRole("button", { name: "Configure Imported agent" })
    ).not.toBeInTheDocument()
    expect(notifications.warning).not.toHaveBeenCalled()
  })

  it("ignores an import refresh failure after leaving workspace home", async () => {
    const pending = deferRefresh()
    const { unmount } = await renderPendingImport()

    unmount()
    pending.reject(new Error("Refresh unavailable"))
    await pending.promise.catch(() => {})
    await tick()

    expect(notifications.warning).not.toHaveBeenCalled()
  })
})
