import { fireEvent, render, screen, within } from "@testing-library/svelte"
import {
  FeatureFlag,
  type PreviewProjectAssignmentResponse,
  ResourceType,
} from "@budibase/types"
import { tick } from "svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockCheckbox from "@/test/mocks/MockCheckbox.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"

const projectFixtures = vi.hoisted(() => [
  {
    _id: "project_1",
    _rev: "1-project",
    name: "Operations",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "project_3",
    _rev: "1-finance",
    name: "Finance",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    _id: "project_2",
    _rev: "1-reporting",
    name: "Reporting",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
])

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Button: MockButton,
  keepOpen: Symbol("keepOpen"),
  Checkbox: MockCheckbox,
  Icon: MockSlot,
  ModalContent: MockModalContent,
  Multiselect: MockSelect,
  ProgressCircle: MockSlot,
}))

vi.mock("@/stores/portal", async () => {
  const { readable } = await import("svelte/store")
  return {
    featureFlags: readable({ [FeatureFlag.PROJECTS]: true }),
    projectsStore: Object.assign(readable(projectFixtures), {
      ensureFetched: vi.fn().mockResolvedValue(undefined),
    }),
  }
})

vi.mock("@/stores/builder", async () => {
  const { readable } = await import("svelte/store")
  return { appStore: readable({ appId: "app_1" }) }
})

import AssignProjectModal from "./AssignProjectModal.svelte"

const resource = {
  id: "workspace_app_1",
  revision: "1-rev",
  name: "Operations",
  typeLabel: "App",
  projectIds: ["project_1"],
}
const automation = {
  id: "automation_1",
  name: "Notify operations",
  type: ResourceType.AUTOMATION,
  projectIdsToAdd: ["project_1"],
}
const datasource = {
  id: "datasource_1",
  name: "Reporting database",
  type: ResourceType.DATASOURCE,
  projectIdsToAdd: ["project_2"],
}
const preview: PreviewProjectAssignmentResponse = {
  resourceRev: "newer-server-rev",
  resourceProjectIds: ["project_1"],
  dependencies: [automation, datasource],
  dependencyFingerprint: "dependency-fingerprint",
}
const advancePreviewDebounce = async () => {
  await vi.advanceTimersByTimeAsync(150)
  await tick()
}
const toggleReportingProject = async () => {
  const projectSelect = screen.getByLabelText("Projects")
  const option = within(projectSelect).getByRole("option", {
    name: "Reporting",
  }) as HTMLOptionElement
  option.selected = !option.selected
  await fireEvent.change(projectSelect)
  await advancePreviewDebounce()
}

describe("AssignProjectModal", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it("selects related resources by default and submits exclusions", async () => {
    const onConfirm = vi.fn()
    render(AssignProjectModal, {
      resource,
      onPreview: vi.fn().mockResolvedValue(preview),
      onConfirm,
    })

    await advancePreviewDebounce()
    await fireEvent.click(screen.getByLabelText(automation.name))
    await fireEvent.click(screen.getByText("Save changes"))

    expect(screen.getByText("1 related resource excluded")).toBeTruthy()
    expect(onConfirm).toHaveBeenCalledWith({
      resourceRev: resource.revision,
      projectIds: ["project_1"],
      dependencyIds: [datasource.id],
      dependencyFingerprint: preview.dependencyFingerprint,
    })
  })

  it("retries a failed dependency preview before saving", async () => {
    const onConfirm = vi.fn()
    render(AssignProjectModal, {
      resource,
      onPreview: vi
        .fn()
        .mockRejectedValueOnce(new Error("preview failed"))
        .mockResolvedValue(preview),
      onConfirm,
    })

    await advancePreviewDebounce()
    await fireEvent.click(screen.getByText("Save changes"))
    expect(onConfirm).not.toHaveBeenCalled()
    await fireEvent.click(screen.getByText("Retry"))
    await advancePreviewDebounce()
    await fireEvent.click(screen.getByText("Save changes"))

    expect(
      screen.queryByText(/Related resources couldn't be loaded/)
    ).toBeNull()
    expect(onConfirm).toHaveBeenCalledWith({
      resourceRev: resource.revision,
      projectIds: ["project_1"],
      dependencyIds: [automation.id, datasource.id],
      dependencyFingerprint: preview.dependencyFingerprint,
    })
  })

  it("refreshes a stale assignment for review, preserving exclusions", async () => {
    const agent = {
      id: "agent_1",
      name: "Support agent",
      type: ResourceType.AGENT,
      projectIdsToAdd: ["project_1"],
    }
    const refreshedPreview = {
      resourceRev: "2-rev",
      resourceProjectIds: ["project_1", "project_3"],
      dependencyFingerprint: "updated-fingerprint",
      dependencies: [agent, automation, datasource],
    }
    const onConfirm = vi
      .fn()
      .mockRejectedValueOnce({ status: 409, message: "Resource has changed" })
      .mockResolvedValue(undefined)
    const onPreview = vi.fn().mockResolvedValue(preview)
    render(AssignProjectModal, { resource, onPreview, onConfirm })

    await advancePreviewDebounce()
    await fireEvent.click(screen.getByLabelText(automation.name))
    const projectSelect = screen.getByLabelText("Projects")
    for (const option of within(projectSelect).getAllByRole("option")) {
      const projectOption = option as HTMLOptionElement
      projectOption.selected = projectOption.textContent === "Reporting"
    }
    await fireEvent.change(projectSelect)
    await advancePreviewDebounce()
    await fireEvent.click(screen.getByText("Save changes"))
    onPreview.mockResolvedValue(refreshedPreview)
    await fireEvent.click(screen.getByText("Refresh and review"))
    await advancePreviewDebounce()
    await advancePreviewDebounce()
    await fireEvent.click(screen.getByText("Save changes"))

    expect(screen.getByLabelText(automation.name)).not.toBeChecked()
    expect(onConfirm).toHaveBeenLastCalledWith({
      resourceRev: refreshedPreview.resourceRev,
      projectIds: ["project_3", "project_2"],
      dependencyIds: [agent.id, datasource.id],
      dependencyFingerprint: refreshedPreview.dependencyFingerprint,
    })
  })

  it("retries a failed save without refreshing the assignment", async () => {
    const onConfirm = vi
      .fn()
      .mockRejectedValueOnce({ status: 503, message: "Please try again" })
      .mockResolvedValue(undefined)
    render(AssignProjectModal, {
      resource,
      onPreview: vi.fn().mockResolvedValue(preview),
      onConfirm,
    })

    await advancePreviewDebounce()
    await fireEvent.click(screen.getByText("Save changes"))
    await fireEvent.click(screen.getByText("Save changes"))

    expect(onConfirm).toHaveBeenCalledTimes(2)
    expect(onConfirm).toHaveBeenLastCalledWith({
      resourceRev: resource.revision,
      projectIds: ["project_1"],
      dependencyIds: [automation.id, datasource.id],
      dependencyFingerprint: preview.dependencyFingerprint,
    })
  })

  it("preserves exclusions when dependencies disappear and return", async () => {
    const onConfirm = vi.fn()
    render(AssignProjectModal, {
      resource,
      onPreview: vi.fn(async ({ projectIds }) => ({
        ...preview,
        dependencies: projectIds.includes("project_2")
          ? [datasource]
          : [automation],
      })),
      onConfirm,
    })

    await advancePreviewDebounce()
    await fireEvent.click(screen.getByLabelText(automation.name))
    await toggleReportingProject()
    await toggleReportingProject()
    await fireEvent.click(screen.getByText("Save changes"))

    expect(screen.getByLabelText(automation.name)).not.toBeChecked()
    expect(onConfirm).toHaveBeenCalledWith({
      resourceRev: resource.revision,
      projectIds: ["project_1"],
      dependencyIds: [],
      dependencyFingerprint: preview.dependencyFingerprint,
    })
  })

  it("ignores preview responses superseded by a project selection change", async () => {
    let resolveFirst!: (response: PreviewProjectAssignmentResponse) => void
    let resolveSecond!: (response: PreviewProjectAssignmentResponse) => void
    const firstPreview = new Promise<PreviewProjectAssignmentResponse>(
      resolve => {
        resolveFirst = resolve
      }
    )
    const secondPreview = new Promise<PreviewProjectAssignmentResponse>(
      resolve => {
        resolveSecond = resolve
      }
    )
    const onConfirm = vi.fn()
    render(AssignProjectModal, {
      resource,
      onPreview: vi
        .fn()
        .mockReturnValueOnce(firstPreview)
        .mockReturnValueOnce(secondPreview),
      onConfirm,
    })

    await advancePreviewDebounce()
    await toggleReportingProject()
    resolveSecond({ ...preview, dependencies: [datasource] })
    await tick()
    resolveFirst({ ...preview, dependencies: [automation] })
    await tick()
    await fireEvent.click(screen.getByText("Save changes"))

    expect(screen.queryByText(automation.name)).toBeNull()
    expect(onConfirm).toHaveBeenCalledWith({
      resourceRev: resource.revision,
      projectIds: ["project_1", "project_2"],
      dependencyIds: [datasource.id],
      dependencyFingerprint: preview.dependencyFingerprint,
    })
  })
})
