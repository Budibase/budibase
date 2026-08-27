import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/svelte"
import {
  FeatureFlag,
  type PreviewProjectAssignmentRequest,
  type PreviewProjectAssignmentResponse,
  ResourceType,
} from "@budibase/types"
import { tick } from "svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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
    _id: "project_2",
    _rev: "1-reporting",
    name: "Reporting",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
])

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Checkbox: MockCheckbox,
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
const dependencyFingerprint = "dependency-fingerprint"
const advancePreviewDebounce = async () => {
  await vi.advanceTimersByTimeAsync(150)
  await tick()
}

describe("AssignProjectModal", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it("selects previewed dependencies by default and submits deselections", async () => {
    const onPreview = vi.fn().mockResolvedValue({
      dependencyFingerprint,
      dependencies: [
        {
          id: "automation_1",
          name: "Notify operations",
          type: ResourceType.AUTOMATION,
          projectIdsToAdd: ["project_1"],
        },
        {
          id: "datasource_1",
          name: "Operations database",
          type: ResourceType.DATASOURCE,
          projectIdsToAdd: ["project_1"],
        },
      ],
    })
    const onConfirm = vi.fn()

    render(AssignProjectModal, {
      props: { resource, onPreview, onConfirm },
    })

    await advancePreviewDebounce()
    await waitFor(() =>
      expect(
        screen.getByText("2 of 2 dependencies will be added.")
      ).toBeTruthy()
    )
    expect(onPreview).toHaveBeenCalledWith({
      resourceId: "workspace_app_1",
      projectIds: ["project_1"],
    })
    expect(
      screen
        .getAllByRole("checkbox")
        .map(checkbox => checkbox.parentElement?.textContent?.trim())
    ).toEqual(["Notify operations", "Operations database"])

    await fireEvent.click(screen.getByLabelText("Notify operations"))
    expect(
      screen.getByText(/Deselected dependencies will not be part/)
    ).toBeTruthy()
    await fireEvent.click(screen.getByText("Save"))

    expect(onConfirm).toHaveBeenCalledWith({
      projectIds: ["project_1"],
      dependencyIds: ["datasource_1"],
      dependencyFingerprint,
    })
  })

  it("blocks saving when the dependency preview fails", async () => {
    const onConfirm = vi.fn()
    render(AssignProjectModal, {
      props: {
        resource,
        onPreview: vi.fn().mockRejectedValue(new Error("preview failed")),
        onConfirm,
      },
    })

    await advancePreviewDebounce()
    await waitFor(() =>
      expect(screen.getByText(/Unable to load dependencies/)).toBeTruthy()
    )
    expect(screen.getByText("Save")).toBeDisabled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("preserves deselections and selects newly discovered dependencies", async () => {
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
    const onPreview = vi.fn(
      async ({ projectIds }: PreviewProjectAssignmentRequest) => ({
        dependencyFingerprint,
        dependencies: projectIds.includes("project_2")
          ? [automation, datasource]
          : [automation],
      })
    )
    const onConfirm = vi.fn()

    render(AssignProjectModal, {
      props: {
        resource,
        onPreview,
        onConfirm,
      },
    })

    await advancePreviewDebounce()
    await waitFor(() =>
      expect(
        screen.getByText("1 of 1 dependencies will be added.")
      ).toBeTruthy()
    )
    await fireEvent.click(screen.getByLabelText("Notify operations"))

    const projectSelect = screen.getByLabelText("Projects")
    const reportingOption = within(projectSelect).getByRole("option", {
      name: "Reporting",
    }) as HTMLOptionElement
    reportingOption.selected = true
    await fireEvent.change(projectSelect)

    await advancePreviewDebounce()
    await waitFor(() =>
      expect(
        screen.getByText("1 of 2 dependencies will be added.")
      ).toBeTruthy()
    )
    expect(screen.getByLabelText("Notify operations")).not.toBeChecked()
    expect(screen.getByLabelText("Reporting database")).toBeChecked()

    await fireEvent.click(screen.getByText("Save"))
    expect(onConfirm).toHaveBeenCalledWith({
      projectIds: ["project_1", "project_2"],
      dependencyIds: ["datasource_1"],
      dependencyFingerprint,
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
    const onPreview = vi
      .fn()
      .mockReturnValueOnce(firstPreview)
      .mockReturnValueOnce(secondPreview)
    const onConfirm = vi.fn()

    render(AssignProjectModal, {
      props: {
        resource,
        onPreview,
        onConfirm,
      },
    })

    await advancePreviewDebounce()
    await waitFor(() => expect(onPreview).toHaveBeenCalledTimes(1))
    const projectSelect = screen.getByLabelText("Projects")
    const reportingOption = within(projectSelect).getByRole("option", {
      name: "Reporting",
    }) as HTMLOptionElement
    reportingOption.selected = true
    await fireEvent.change(projectSelect)
    await advancePreviewDebounce()
    await waitFor(() => expect(onPreview).toHaveBeenCalledTimes(2))

    resolveSecond({
      dependencyFingerprint,
      dependencies: [
        {
          id: "datasource_latest",
          name: "Latest dependency",
          type: ResourceType.DATASOURCE,
          projectIdsToAdd: ["project_2"],
        },
      ],
    })
    await waitFor(() =>
      expect(screen.getByText("Latest dependency")).toBeTruthy()
    )

    resolveFirst({
      dependencyFingerprint: "stale-fingerprint",
      dependencies: [
        {
          id: "automation_stale",
          name: "Stale dependency",
          type: ResourceType.AUTOMATION,
          projectIdsToAdd: ["project_1"],
        },
      ],
    })
    await tick()

    expect(screen.queryByText("Stale dependency")).toBeNull()
    expect(screen.getByText("Latest dependency")).toBeTruthy()

    await fireEvent.click(screen.getByText("Save"))
    expect(onConfirm).toHaveBeenCalledWith({
      projectIds: ["project_1", "project_2"],
      dependencyIds: ["datasource_latest"],
      dependencyFingerprint,
    })
  })
})
