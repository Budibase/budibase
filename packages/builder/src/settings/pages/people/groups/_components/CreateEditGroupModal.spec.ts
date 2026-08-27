import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockBody from "@/test/mocks/MockBody.svelte"
import MockColorPicker from "@/test/mocks/MockColorPicker.svelte"
import MockIconPicker from "@/test/mocks/MockIconPicker.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"
import MockToggle from "@/test/mocks/MockToggle.svelte"

vi.mock("@budibase/bbui", () => ({
  keepOpen: Symbol("keepOpen"),
  ColorPicker: MockColorPicker,
  Body: MockBody,
  ModalContent: MockModalContent,
  Input: MockInput,
  IconPicker: MockIconPicker,
  Toggle: MockToggle,
}))

import CreateEditGroupModal from "./CreateEditGroupModal.svelte"

const buildGroup = (overrides = {}) => ({
  _id: "group-1",
  _rev: "rev-1",
  name: "Actions",
  icon: "UserGroup",
  color: "#336699",
  users: [],
  ...overrides,
})

describe("CreateEditGroupModal", () => {
  it("keeps synced group names read-only while leaving other fields editable", () => {
    render(CreateEditGroupModal, {
      props: {
        group: buildGroup({
          scimInfo: { isSync: true },
        }),
        saveGroup: vi.fn(),
      },
    })

    expect(screen.getByLabelText("Name")).toBeDisabled()
    expect(screen.getByLabelText("Icon")).not.toBeDisabled()
    expect(screen.getByLabelText("Color")).not.toBeDisabled()
  })

  it("allows non-scim groups to edit all exposed fields", () => {
    render(CreateEditGroupModal, {
      props: {
        group: buildGroup(),
        saveGroup: vi.fn(),
      },
    })

    expect(screen.getByLabelText("Name")).not.toBeDisabled()
    expect(screen.getByLabelText("Icon")).not.toBeDisabled()
    expect(screen.getByLabelText("Color")).not.toBeDisabled()
  })

  it("edits a draft without mutating the supplied group", async () => {
    const group = buildGroup()
    const saveGroup = vi.fn()
    render(CreateEditGroupModal, {
      props: { group, saveGroup },
    })

    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Updated group" },
    })
    await fireEvent.input(screen.getByLabelText("Icon"), {
      target: { value: "briefcase" },
    })
    await fireEvent.input(screen.getByLabelText("Color"), {
      target: { value: "#112233" },
    })

    expect(group).toMatchObject({
      name: "Actions",
      icon: "UserGroup",
      color: "#336699",
    })

    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(saveGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Updated group",
        icon: "briefcase",
        color: "#112233",
      })
    )
  })

  it("resets the draft when the group prop changes", async () => {
    const saveGroup = vi.fn()
    const { rerender } = render(CreateEditGroupModal, {
      props: { group: buildGroup(), saveGroup },
    })
    await fireEvent.input(screen.getByLabelText("Name"), {
      target: { value: "Stale draft" },
    })

    const replacementGroup = buildGroup({
      _id: "group-2",
      name: "Replacement group",
      icon: "briefcase",
      color: "#112233",
    })
    await rerender({ group: replacementGroup, saveGroup })

    expect(screen.getByLabelText("Name")).toHaveValue("Replacement group")
    expect(screen.getByLabelText("Icon")).toHaveValue("briefcase")
    expect(screen.getByLabelText("Color")).toHaveValue("#112233")

    await fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(saveGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "group-2",
        name: "Replacement group",
      })
    )
  })
})
