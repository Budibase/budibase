import { fireEvent, render, screen } from "@testing-library/svelte"
import { FeatureFlag, SourceName } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import { featureFlags } from "@/stores/portal"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import ConfigEditor from "./index.svelte"

vi.mock("@budibase/bbui", () => ({
  Body: MockBody,
  Layout: MockSlot,
  ModalContent: MockModalContent,
  keepOpen: Symbol("keepOpen"),
}))

vi.mock("./ConfigInput.svelte", () => ({ default: MockSlot }))
vi.mock("@/components/common/ProjectSelect.svelte", () => ({
  default: MockSlot,
}))

vi.mock("./stores/validatedConfig", async () => {
  const { readable } = await import("svelte/store")
  return {
    createValidatedConfigStore: () => ({
      ...readable({ config: {}, validatedConfig: [], preventSubmit: false }),
      markAllFieldsActive: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    }),
  }
})

vi.mock("./stores/validatedName", async () => {
  const { readable } = await import("svelte/store")
  return {
    createValidatedNameStore: () => ({
      ...readable({ name: "Reporting database", preventSubmit: false }),
      markActive: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    }),
  }
})

vi.mock("@/stores/portal", async () => {
  const { writable } = await import("svelte/store")
  return { featureFlags: writable({ [FeatureFlag.PROJECTS]: false }) }
})

const renderEditor = (onSubmit: ReturnType<typeof vi.fn>) =>
  render(ConfigEditor, {
    integration: {
      name: SourceName.REST,
      docs: "",
      description: "REST datasource",
      friendlyName: "REST",
      query: {},
    },
    config: {},
    projectIdsValue: ["project_1"],
    showProjectField: true,
    onSubmit,
  })

describe("datasource creation project selection", () => {
  it("submits selected projects when the flag is enabled", async () => {
    featureFlags.update(flags => ({ ...flags, [FeatureFlag.PROJECTS]: true }))
    const onSubmit = vi.fn()
    renderEditor(onSubmit)

    await fireEvent.click(screen.getByText("Save and continue to query"))

    expect(onSubmit).toHaveBeenCalledWith({
      config: {},
      name: "Reporting database",
      projectIds: ["project_1"],
    })
  })

  it("omits preset projects when the flag is explicitly disabled", async () => {
    featureFlags.update(flags => ({ ...flags, [FeatureFlag.PROJECTS]: false }))
    const onSubmit = vi.fn()
    renderEditor(onSubmit)

    await fireEvent.click(screen.getByText("Save and continue to query"))

    expect(onSubmit).toHaveBeenCalledWith({
      config: {},
      name: "Reporting database",
      projectIds: undefined,
    })
  })
})
