import { fireEvent, render, screen } from "@testing-library/svelte"
import { SourceName, type Datasource } from "@budibase/types"
import { tick } from "svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModal from "@/test/mocks/MockModal.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

const mocks = vi.hoisted(() => ({
  save: vi.fn(),
}))

vi.mock("@budibase/bbui", () => ({
  Input: MockInput,
  Modal: MockModal,
  ModalContent: MockModalContent,
  notifications: { success: vi.fn() },
}))

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  return {
    datasources: Object.assign(writable({ list: [] }), {
      save: mocks.save,
    }),
    integrations: writable([]),
  }
})

vi.mock("@/stores/selectors", () => ({
  integrationForDatasource: vi.fn(),
}))

import UpdateDatasourceModal from "./UpdateDatasourceModal.svelte"

describe("UpdateDatasourceModal", () => {
  beforeEach(() => {
    mocks.save.mockReset().mockResolvedValue(undefined)
  })

  it("disables save after reopening a successfully renamed datasource", async () => {
    const datasource: Datasource = {
      _id: "datasource_1",
      _rev: "1-rev",
      type: "datasource",
      source: SourceName.POSTGRES,
      name: "Original",
    }
    const { component, rerender } = render(UpdateDatasourceModal, {
      datasource,
    })
    component.show()
    await tick()

    expect(screen.getByText("Save")).toBeDisabled()
    await fireEvent.input(screen.getByLabelText("Datasource Name"), {
      target: { value: "Renamed" },
    })
    await fireEvent.click(screen.getByText("Save"))
    expect(mocks.save).toHaveBeenCalledWith(
      expect.objectContaining({
        datasource: expect.objectContaining({ name: "Renamed" }),
      })
    )

    await rerender({ datasource: { ...datasource, name: "Renamed" } })
    component.show()
    await tick()

    expect(screen.getByLabelText("Datasource Name")).toHaveValue("Renamed")
    expect(screen.getByText("Save")).toBeDisabled()
  })
})
