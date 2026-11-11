import { fireEvent, render, screen } from "@testing-library/svelte"
import { SourceName } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
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

const renderEditor = ({
  onSubmit,
  projectIds = ["project_1"],
}: {
  onSubmit: () => void
  projectIds?: string[]
}) =>
  render(ConfigEditor, {
    integration: {
      name: SourceName.REST,
      docs: "",
      description: "REST datasource",
      friendlyName: "REST",
      query: {},
    },
    config: {},
    projectIdsValue: projectIds,
    showProjectField: true,
    onSubmit,
  })

describe("datasource creation project selection", () => {
  it("submits selected projects", async () => {
    const onSubmit = vi.fn()
    renderEditor({ onSubmit })

    await fireEvent.click(screen.getByText("Save and continue to query"))

    expect(onSubmit).toHaveBeenCalledWith({
      config: {},
      name: "Reporting database",
      projectIds: ["project_1"],
    })
  })

  it("omits projects when none are selected", async () => {
    const onSubmit = vi.fn()
    renderEditor({ onSubmit, projectIds: [] })

    await fireEvent.click(screen.getByText("Save and continue to query"))

    expect(onSubmit).toHaveBeenCalledWith({
      config: {},
      name: "Reporting database",
      projectIds: undefined,
    })
  })
})
