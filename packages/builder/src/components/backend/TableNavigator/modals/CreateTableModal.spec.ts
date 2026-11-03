import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import MockTableImportState from "@/test/mocks/MockTableImportState.svelte"
import CreateTableModal from "./CreateTableModal.svelte"

vi.mock("@budibase/bbui", () => ({
  Input: MockInput,
  ModalContent: MockModalContent,
  notifications: { success: vi.fn(), error: vi.fn() },
}))
vi.mock("@/api", () => ({ API: {} }))
vi.mock("@/constants/backend", () => ({
  BUDIBASE_INTERNAL_DB_ID: "datasource_internal",
  BUDIBASE_DATASOURCE_TYPE: "datasource",
  FIELDS: {},
}))
vi.mock("@/stores/builder", async () => {
  const { readable } = await import("svelte/store")
  return {
    tables: readable({ list: [] }),
    datasources: readable({ list: [], selected: null }),
    dataEnvironmentStore: {},
  }
})
vi.mock("@roxi/routify", async () => {
  const { readable } = await import("svelte/store")
  return {
    goto: readable(vi.fn()),
    url: readable(() => "/builder/workspace/test/data"),
  }
})
vi.mock("@/components/common/ProjectSelect.svelte", () => ({
  default: MockSlot,
}))
vi.mock("../TableDataImport.svelte", () => ({
  default: MockTableImportState,
}))

describe("CreateTableModal import validation", () => {
  it("allows creating a named table without importing a file", () => {
    render(CreateTableModal, { props: { name: "Contacts" } })

    expect(screen.getByRole("button", { name: "Create" })).toBeEnabled()
  })

  it.each(["Start import", "Reject import"])(
    "disables Create with empty imported rows after %s",
    async action => {
      render(CreateTableModal, { props: { name: "Contacts" } })
      await fireEvent.click(screen.getByRole("button", { name: action }))

      expect(screen.getByRole("button", { name: "Create" })).toBeDisabled()
    }
  )
})
