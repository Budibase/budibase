import { fireEvent, render, screen, within } from "@testing-library/svelte"
import type {
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
    workspaceApps: createStore({ workspaceApps: apps }),
    ensureFetched: vi.fn().mockResolvedValue(undefined),
    fetchProjects: vi.fn(),
    hasFetchedProjects: vi.fn().mockReturnValue(true),
    fetchAgents: vi.fn().mockResolvedValue(undefined),
    refreshWorkspace: vi.fn().mockResolvedValue(undefined),
    previewAssignment:
      vi.fn<
        (
          request: PreviewProjectAssignmentRequest
        ) => Promise<PreviewProjectAssignmentResponse>
      >(),
    saveAssignment: vi.fn(),
    updateAssignment: vi.fn().mockResolvedValue(undefined),
    deleteResource: vi.fn(),
    notifications: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
    automations: createStore({
      automations: [
        {
          _id: "automation_operations",
          _rev: "1-automation",
          name: "Operations workflow",
          projectIds: ["project_operations", "project_finance"],
          publishStatus: { state: "draft" },
          definition: { trigger: {}, steps: [] },
        },
      ],
    }),
    agents: createStore({
      agents: [
        {
          _id: "agent_operations",
          _rev: "1-agent",
          name: "Operations assistant",
          projectIds: ["project_operations", "project_finance"],
        },
      ],
    }),
    datasources: createStore({
      list: [
        {
          _id: "datasource_operations",
          _rev: "1-datasource",
          name: "Operations connection",
          source: "REST",
          projectIds: ["project_operations", "project_finance"],
        },
      ],
    }),
    tables: createStore({
      list: [
        {
          _id: "ta_operations",
          _rev: "1-table",
          name: "Operations records",
          sourceId: "bb_internal",
          projectIds: ["project_operations", "project_finance"],
        },
      ],
    }),
    openContextMenu:
      vi.fn<
        (
          id: string,
          items: { name: string; icon: string; callback: () => void }[],
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
  notifications: mocks.notifications,
}))

vi.mock("@roxi/routify", () => ({
  goto: mocks.createStore(vi.fn()),
  url: mocks.createStore((route: string) => route),
}))

vi.mock("@/stores/builder", () => ({
  workspaceStore: Object.assign(
    mocks.createStore({ appId: "app_dev_test", name: "Team workspace" }),
    { refresh: mocks.refreshWorkspace }
  ),
  automationStore: Object.assign(mocks.automations, {
    actions: { delete: mocks.deleteResource },
  }),
  contextMenuStore: { open: mocks.openContextMenu },
  datasources: mocks.datasources,
  tables: mocks.tables,
  workspaceAppStore: Object.assign(mocks.workspaceApps, {
    delete: mocks.deleteResource,
  }),
  workspaceFavouriteStore: { lookup: mocks.createStore({}) },
}))

vi.mock("@/stores/portal", () => ({
  auth: mocks.createStore({ user: { _id: "user_builder" } }),
  enrichedApps: mocks.createStore([]),
  featureFlags: mocks.createStore({ PROJECTS: true }),
  licensing: mocks.createStore({ isEnterprisePlan: true }),
  agentsStore: Object.assign(mocks.agents, {
    fetchAgents: mocks.fetchAgents,
    deleteAgent: mocks.deleteResource,
  }),
  workspacesStore: mocks.createStore({ apps: [] }),
  projectsStore: Object.assign(mocks.projects, {
    fetch: mocks.fetchProjects,
    ensureFetched: mocks.ensureFetched,
    hasFetched: mocks.hasFetchedProjects,
    previewAssignment: mocks.previewAssignment,
    updateAssignment: mocks.updateAssignment,
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
  items.find(item => item.name === "Assign projects")!.callback()
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
    mocks.hasFetchedProjects.mockReturnValue(true)
    mocks.ensureFetched.mockImplementation(async () => get(mocks.projects))
    mocks.saveAssignment.mockResolvedValue(undefined)
    mocks.updateAssignment.mockResolvedValue(undefined)
    mocks.refreshWorkspace.mockResolvedValue(undefined)
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
    expect(mocks.ensureFetched).toHaveBeenCalledWith("app_dev_test")
    expect(window.location.search).toBe("?project=project_operations")
  })

  it("does not retry a failed initial project load for a setup deep link", async () => {
    mocks.projects.set([])
    mocks.hasFetchedProjects.mockReturnValue(false)
    mocks.ensureFetched.mockRejectedValue(new Error("Unable to load projects"))
    history.replaceState(
      {},
      "",
      "/builder/workspace/app_dev_test/home?project=project_operations&setup=project_operations"
    )

    render(WorkspaceHome)
    await vi.advanceTimersByTimeAsync(0)

    expect(mocks.ensureFetched).not.toHaveBeenCalled()
    expect(mocks.fetchProjects).not.toHaveBeenCalled()
    expect(mocks.notifications.error).not.toHaveBeenCalled()
    expect(screen.queryByText("Project setup")).not.toBeInTheDocument()
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
    "starts a fresh assignment when Assign projects is chosen again for $name",
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

  it.each([
    {
      type: "app",
      name: "Operations portal",
      id: "workspace_app_operations",
      revision: "1-operations",
    },
    {
      type: "automation",
      name: "Operations workflow",
      id: "automation_operations",
      revision: "1-automation",
    },
    {
      type: "agent",
      name: "Operations assistant",
      id: "agent_operations",
      revision: "1-agent",
    },
    {
      type: "datasource",
      name: "Operations connection",
      id: "datasource_operations",
      revision: "1-datasource",
    },
    {
      type: "table",
      name: "Operations records",
      id: "ta_operations",
      revision: "1-table",
    },
  ])(
    "removes an $type from the selected project while preserving its other assignments",
    async ({ name, id, revision }) => {
      mocks.workspaceApps.set({
        workspaceApps: mocks.apps.map(app => ({
          ...app,
          projectIds: [...app.projectIds, "project_finance"],
        })),
      })
      mocks.previewAssignment.mockRejectedValue(
        new Error("Unable to build dependency graph")
      )
      history.replaceState(
        {},
        "",
        "/builder/workspace/app_dev_test/home?project=project_operations"
      )
      render(WorkspaceHome)
      await tick()
      await openContextMenu({ name })
      const [, items] = mocks.openContextMenu.mock.lastCall!
      const remove = items.find(item => item.name === "Remove from project")!
      remove.callback()
      await tick()

      expect(remove.icon).toBe("stack-minus")
      expect(
        screen.getByRole("heading", { name: "Remove from project" })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          "The resource will remain available in the workspace and any other projects.",
          { exact: false }
        )
      ).toHaveTextContent(name)

      await fireEvent.click(screen.getByRole("button", { name: "Remove" }))

      expect(mocks.updateAssignment).toHaveBeenCalledExactlyOnceWith({
        resourceId: id,
        request: {
          resourceRev: revision,
          projectIds: ["project_finance"],
          dependencyIds: [],
          dependencyFingerprint: "",
        },
      })
      expect(mocks.deleteResource).not.toHaveBeenCalled()
      expect(mocks.previewAssignment).not.toHaveBeenCalled()
      expect(mocks.notifications.success).toHaveBeenCalledWith(
        `Removed '${name}' from 'Operations'`
      )
      expect(mocks.refreshWorkspace).toHaveBeenCalledOnce()
    }
  )

  it.each([
    "Operations portal",
    "Operations workflow",
    "Operations assistant",
    "Operations connection",
    "Operations records",
  ])(
    "waits for the URL-selected project before opening the menu for %s",
    async name => {
      const projects = get(mocks.projects)
      mocks.projects.set([])
      mocks.hasFetchedProjects.mockReturnValue(false)
      history.replaceState(
        {},
        "",
        "/builder/workspace/app_dev_test/home?project=project_operations"
      )
      render(WorkspaceHome)
      await tick()

      await openContextMenu({ name })

      mocks.hasFetchedProjects.mockReturnValue(true)
      mocks.projects.set(projects)
      await tick()
      await openContextMenu({ name })

      expect(mocks.openContextMenu).toHaveBeenCalledOnce()
      const [, items] = mocks.openContextMenu.mock.lastCall!
      expect(items.some(item => item.name === "Remove from project")).toBe(true)
      expect(mocks.deleteResource).not.toHaveBeenCalled()
    }
  )

  it("keeps permanent deletion in the workspace-wide menu", async () => {
    render(WorkspaceHome)
    await openContextMenu({ name: "Operations portal" })

    const [, items] = mocks.openContextMenu.mock.lastCall!
    expect(items.find(item => item.name === "Delete")?.icon).toBe("trash")
    expect(items.some(item => item.name === "Remove from project")).toBe(false)
  })

  it.each([
    {
      name: "Operations portal",
      confirmText: "Delete App",
      successMessage: "App 'Operations portal' deleted successfully",
      expectedArguments: ["workspace_app_operations", "1-operations"],
    },
    {
      name: "Operations workflow",
      confirmText: "Delete Automation",
      successMessage: "Automation deleted successfully",
      expectedArguments: [get(mocks.automations).automations[0]],
    },
    {
      name: "Operations assistant",
      confirmText: "Delete Agent",
      successMessage: "Agent deleted successfully",
      expectedArguments: ["agent_operations"],
    },
  ])(
    "allows permanent deletion of $name from the project view",
    async ({ name, confirmText, successMessage, expectedArguments }) => {
      history.replaceState(
        {},
        "",
        "/builder/workspace/app_dev_test/home?project=project_operations"
      )
      render(WorkspaceHome)
      await tick()
      await openContextMenu({ name })
      const [, items] = mocks.openContextMenu.mock.lastCall!
      items.find(item => item.name === "Delete")!.callback()
      await tick()
      await fireEvent.click(screen.getByRole("button", { name: confirmText }))

      expect(items.some(item => item.name === "Remove from project")).toBe(true)
      expect(mocks.deleteResource).toHaveBeenCalledExactlyOnceWith(
        ...expectedArguments
      )
      expect(mocks.updateAssignment).not.toHaveBeenCalled()
      expect(mocks.notifications.success).toHaveBeenCalledWith(successMessage)
    }
  )

  it("keeps the resource when removing its last project assignment", async () => {
    history.replaceState(
      {},
      "",
      "/builder/workspace/app_dev_test/home?project=project_operations"
    )
    render(WorkspaceHome)
    await tick()
    await openContextMenu({ name: "Operations portal" })
    const [, items] = mocks.openContextMenu.mock.lastCall!
    items.find(item => item.name === "Remove from project")!.callback()
    await tick()
    await fireEvent.click(screen.getByRole("button", { name: "Remove" }))

    expect(mocks.updateAssignment).toHaveBeenCalledExactlyOnceWith({
      resourceId: "workspace_app_operations",
      request: {
        resourceRev: "1-operations",
        projectIds: [],
        dependencyIds: [],
        dependencyFingerprint: "",
      },
    })
    expect(mocks.deleteResource).not.toHaveBeenCalled()
    expect(mocks.notifications.success).toHaveBeenCalledWith(
      "Removed 'Operations portal' from 'Operations'"
    )
  })

  it("reports a failed removal without deleting the resource or reporting success", async () => {
    mocks.updateAssignment.mockRejectedValueOnce(
      new Error("Resource revision does not match.")
    )
    history.replaceState(
      {},
      "",
      "/builder/workspace/app_dev_test/home?project=project_operations"
    )
    render(WorkspaceHome)
    await tick()
    await openContextMenu({ name: "Operations portal" })
    const [, items] = mocks.openContextMenu.mock.lastCall!
    items.find(item => item.name === "Remove from project")!.callback()
    await tick()
    await fireEvent.click(screen.getByRole("button", { name: "Remove" }))

    expect(mocks.notifications.error).toHaveBeenCalledWith(
      "Resource revision does not match."
    )
    expect(mocks.notifications.success).not.toHaveBeenCalled()
    expect(mocks.deleteResource).not.toHaveBeenCalled()
    expect(mocks.refreshWorkspace).not.toHaveBeenCalled()
  })
})
